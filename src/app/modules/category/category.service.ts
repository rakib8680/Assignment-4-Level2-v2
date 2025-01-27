import { JwtPayload } from "jsonwebtoken";
import { TCategory } from "./category.interface";
import { CategoryModel } from "./category.model";

// create category
const createCategory = async (payload: TCategory, creator: JwtPayload) => {
  payload.createdBy = creator._id;
  const result = await CategoryModel.create(payload);
  return result;
};

// get all categories
const getAllCategories = async () => {
  const result = await CategoryModel.find().populate({
    path: "createdBy",
    select: "_id username email role",
  });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
};
