import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { reviewServices } from "./review.sevice";
import sendResponse from "../../utils/sendResponse";

// create review
const createReview = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await reviewServices.createReview(payload, req.user);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

// get all reviews
const getAllReviews = catchAsync(async (req, res) => {
  const result = await reviewServices.getAllReviews();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Reviews fetched successfully",
    data: result,
  });
});

// delete review
const deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await reviewServices.deleteReview(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Review deleted successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getAllReviews,
  deleteReview,
};
