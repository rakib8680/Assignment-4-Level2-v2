import catchAsync from "../../utils/catchAsync";
import { CategoryService } from "./category.service";

// create category
const createCategory = catchAsync(async (req, res) => {
  const categoryData = req.body;
  const result = await CategoryService.createCategory(categoryData);
  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "Category created successfully",
    data: result,
  });
});

// get all categories
const getAllCategories = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategories();
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "All categories fetched successfully",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
};
