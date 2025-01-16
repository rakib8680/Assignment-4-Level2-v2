import { Router } from "express";
import { CategoryController } from "./category.controller";
import requestValidation from "../../middlewares/requestValidation";
import { categoryValidationSchema } from "./category.validation";

const router = Router();

router.get("/all-categories", CategoryController.getAllCategories);
router.post(
  "/create-category",
  requestValidation(categoryValidationSchema),
  CategoryController.createCategory
);

export const CategoryRoutes = router;
