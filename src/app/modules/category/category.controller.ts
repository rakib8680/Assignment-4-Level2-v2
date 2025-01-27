import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CategoryService } from "./category.service";

// create category
const createCategory = catchAsync(async (req, res) => {
  const categoryData = req.body;
  const result = await CategoryService.createCategory(categoryData, req.user);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Category created successfully",
    data: result,
  });
});

// get all categories
const getAllCategories = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategories();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Categories fetched successfully",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
};
