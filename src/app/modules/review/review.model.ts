import { Schema, model } from "mongoose";
import { TReview } from "./review.interface";

const reviewSchema = new Schema<TReview>({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "course",
    required: [true, "Course ID is required"],
  },
  rating: { type: Number, required: [true, "Rating is required"] },
  review: String,
});

export const ReviewModel = model<TReview>("review", reviewSchema);
