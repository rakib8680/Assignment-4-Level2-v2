import status from "http-status";
import AppError from "../../errors/AppError";
import QueryBuilder from "../../helpers/queryBuilder";
import { courseSearchableFields } from "./course.constant";
import { TCourse } from "./course.interface";
import { CourseModel } from "./course.model";
import mongoose from "mongoose";

// create a course
const createCourse = async (payload: TCourse) => {
  const result = await CourseModel.create(payload);
  return result;
};

// get all courses
const getAllCourses = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate("categoryId"),
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
  const result = await CourseModel.findById(id).populate("categoryId");
  return result;
};

// get single course with reviews
const getCourseWithReviews = async (id: string) => {
  const result = await CourseModel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "courseId",
        as: "reviews",
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        provider: 1,
        reviews: {
          rating: 1,
          review: 1,
        },
      },
    },
  ]);
  return result;
};

// get the best course based on average rating
const getBestCourse = async () => {
  const result = await CourseModel.aggregate([
    {
      $lookup: {  // join reviews collection
        from: "reviews",
        localField: "_id",
        foreignField: "courseId",
        as: "reviews",
      },
    },
    {
      $addFields: { // add averageRating and reviewCount fields
        averageRating: { $round: [{ $avg: "$reviews.rating" }, 2] },
        reviewCount: { $size: "$reviews" },
      },
    },
    {
      $sort: { // sort by averageRating and reviewCount in descending order
        averageRating: -1,
        reviewCount: -1,
      },
    },
    {
      $limit: 1, // get the first document
    },
    {
      $project: { // remove reviews field
        reviews: false,
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
