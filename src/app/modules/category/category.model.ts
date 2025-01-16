import { Schema, model } from "mongoose";
import { TCategory } from "./category.interface";

const categorySchema = new Schema<TCategory>({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
  },
});

export const CategoryModel = model<TCategory>("category", categorySchema);
