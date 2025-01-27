import status from "http-status";
import AppError from "../../errors/AppError";
import { TReview } from "./review.interface";
import { ReviewModel } from "./review.model";
import { JwtPayload } from "jsonwebtoken";
import { CourseModel } from "../course/course.model";

// create review
const createReview = async (payload: TReview, creator: JwtPayload) => {

  // check if course exist 
  const course = await CourseModel.findById(payload.course);
  if (!course) throw new AppError(status.NOT_FOUND, "Course doesn't exist");

  // add creator id to payload
  payload.createdBy = creator._id;
  const result = await ReviewModel.create(payload);
  return result;
};

// get all reviews
const getAllReviews = async () => {
  const result = await ReviewModel.find();
  return result;
};

// delete review
const deleteReview = async (id: string) => {
  const result = await ReviewModel.findByIdAndDelete(id);
  if (result === null) throw new AppError(status.NOT_FOUND, "Review not found");
  return result;
};

export const reviewServices = {
  createReview,
  getAllReviews,
  deleteReview,
};
