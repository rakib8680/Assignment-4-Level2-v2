import status from "http-status";
import AppError from "../../errors/AppError";
import QueryBuilder from "../../helpers/queryBuilder";
import { courseSearchableFields } from "./course.constant";
import { TCourse } from "./course.interface";
import { CourseModel } from "./course.model";
import mongoose from "mongoose";
import { CategoryModel } from "../category/category.model";
import { JwtPayload } from "jsonwebtoken";

// create a course
const createCourse = async (payload: TCourse, creator: JwtPayload) => {
  // check if category exists
  const { category } = payload;
  const isCategoryExists = await CategoryModel.findById(category);
  if (!isCategoryExists) {
    throw new AppError(status.BAD_REQUEST, "Category does not exist");
  }

  // add createdBy field to the payload
  payload.createdBy = creator._id;

  const result = await CourseModel.create(payload);
  return result;
};

// get all courses
const getAllCourses = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate("category").populate({
      path: "createdBy",
      select: "_id username email role",
    }),
    query
  )
    .search(courseSearchableFields)
    .filter()
    .filterPrice()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();

  return {
    meta,
    result,
  };
};

// update course
const updateCourse = async (id: string, payload: Partial<TCourse>) => {
  // check if course exists
  if (!(await CourseModel.findById(id))) {
    throw new AppError(status.NOT_FOUND, "Course does not exist");
  }

  // separate non-primitive fields from payload
  const { tags, details, ...remainingCourseData } = payload;

  // use transaction to avoid data inconsistency in case of failure
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // // update primitive data (transaction-1)
    // await CourseModel.findByIdAndUpdate(id, remainingCourseData, {
    //   new: true,
    //   runValidators: true,
    //   session,
    // });

    //  update primitive data and  details (transaction-1)
    const modifiedUpdatableData: Record<string, unknown> = {
      ...remainingCourseData,
    };
    if (details && Object.keys(details).length) {
      for (const [key, value] of Object.entries(details)) {
        modifiedUpdatableData[`details.${key}`] = value;
      }
    }
    await CourseModel.findByIdAndUpdate(id, modifiedUpdatableData, {
      new: true,
      runValidators: true,
      session,
    });

    // update tags
    if (tags && tags.length) {
      // filter out the deletable tags and remove them from the course (transaction-2)
      const deletableTags = tags
        .filter((tag) => tag.name && tag.isDeleted)
        .map((tag) => tag.name);

      await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            tags: {
              name: {
                $in: deletableTags,
              },
            },
          },
        },
        { session }
      );

      // filter out the new tags and add them to the course (transaction-3)
      const newTags = tags.filter((tag) => tag.name && !tag.isDeleted);
      await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            tags: {
              $each: newTags,
            },
          },
        },
        { session }
      );
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(status.INTERNAL_SERVER_ERROR, err);
  }

  // fetch the updated course
  const result = await CourseModel.findById(id).populate("category").populate({
    path: "createdBy",
    select: "_id username email role",
  });
  return result;
};

// get single course with reviews
const getCourseWithReviews = async (id: string) => {
  const result = await CourseModel.aggregate([
    // Match the course by its ID
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
    // Lookup the user who created the course
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    // Unwind the createdBy array (since lookup returns an array)
    {
      $unwind: "$createdBy",
    },
    // Lookup the reviews for the course
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "course",
        as: "reviews",
      },
    },
    // Unwind the reviews array (since lookup returns an array)
    {
      $unwind: "$reviews",
    },
    // Lookup the user who created each review
    {
      $lookup: {
        from: "users",
        localField: "reviews.createdBy",
        foreignField: "_id",
        as: "reviews.createdBy",
      },
    },
    // Unwind the reviews.createdBy array (since lookup returns an array)
    {
      $unwind: "$reviews.createdBy",
    },
    // Group the course and its reviews together
    {
      $group: {
        _id: "$_id",
        course: {
          $first: "$$ROOT", // $$ROOT returns the original document
        },
        reviews: {
          $push: {
            _id: "$reviews._id",
            rating: "$reviews.rating",
            review: "$reviews.review",
            createdBy: "$reviews.createdBy",
          },
        },
      },
    },
    // Add the reviews array back to the course document
    {
      $addFields: {
        "course.reviews": "$reviews",
      },
    },
    // Replace the root document with the course document
    {
      $replaceRoot: { newRoot: "$course" },
    },
    // Project to exclude certain fields from the output
    {
      $project: {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        "createdBy.password": 0,
        "createdBy.passwordChangedAt": 0,
        "createdBy.createdAt": 0,
        "createdBy.updatedAt": 0,
        "reviews.createdBy.password": 0,
        "reviews.createdBy.createdAt": 0,
        "reviews.createdBy.updatedAt": 0,
      },
    },
  ]);
  return result;
};

// get the best course based on average rating  todo:populate createdBy.............................
const getBestCourse = async () => {
  const result = await CourseModel.aggregate([
    // join reviews collection
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "course",
        as: "reviews",
      },
    },
    {
      // join users collection
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      // unwind the createdBy array (since lookup returns an array)
      $unwind: "$createdBy",
    },
    {
      // add averageRating and reviewCount fields
      $addFields: {
        averageRating: { $round: [{ $avg: "$reviews.rating" }, 2] },
        reviewCount: { $size: "$reviews" },
      },
    },
    {
      // sort by averageRating and reviewCount in descending order
      $sort: {
        averageRating: -1,
        reviewCount: -1,
      },
    },
    {
      $limit: 1, // get the first document
    },
    {
      $project: {
        // remove reviews field
        reviews: false,
        __v: 0,
        "createdBy.password": 0,
        "createdBy.passwordChangedAt": 0,
        "createdBy.createdAt": 0,
        "createdBy.updatedAt": 0,
      },
    },
  ]);

  return result;
};

export const CourseServices = {
  createCourse,
  getAllCourses,
  updateCourse,
  getCourseWithReviews,
  getBestCourse,
};
