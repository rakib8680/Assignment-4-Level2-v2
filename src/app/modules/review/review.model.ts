import { Schema, model } from "mongoose";
import { TReview } from "./review.interface";

const reviewSchema = new Schema<TReview>({
  course: {
    type: Schema.Types.ObjectId,
    ref: "course",
    required: [true, "Course ID is required"],
  },
  rating: { type: Number, required: [true, "Rating is required"] },
  review: String,
},{
  timestamps: true,
});

export const ReviewModel = model<TReview>("review", reviewSchema);
