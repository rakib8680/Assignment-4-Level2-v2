import { Types } from "mongoose";

export type TReview = {
  course: Types.ObjectId;
  rating: number;
  review: string;
};
