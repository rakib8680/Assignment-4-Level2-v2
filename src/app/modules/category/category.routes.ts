import { Router } from "express";
import { CategoryController } from "./category.controller";
import requestValidation from "../../middlewares/requestValidation";
import { categoryValidationSchema } from "./category.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE_ENUM } from "../user/user.constant";

const router = Router();

router.get("/all-categories", CategoryController.getAllCategories);
router.post(
  "/create-category",
  auth(USER_ROLE_ENUM.admin),
  requestValidation(categoryValidationSchema),
  CategoryController.createCategory
);

export const CategoryRoutes = router;
