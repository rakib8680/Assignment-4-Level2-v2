import status from "http-status";
import AppError from "../../errors/AppError";
import { TReview } from "./review.interface";
import { ReviewModel } from "./review.model";

// create review
const createReview = async (payload: TReview) => {
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
