import { TCategory } from "./category.interface";
import { CategoryModel } from "./category.model";

// create category
const createCategory = async (payload: TCategory) => {
  const result = await CategoryModel.create(payload);
  return result;
};


// get all categories 
const getAllCategories = async ()=>{
  const result = await CategoryModel.find();
  return result;
}

export const CategoryService = {
  createCategory,
  getAllCategories
};
