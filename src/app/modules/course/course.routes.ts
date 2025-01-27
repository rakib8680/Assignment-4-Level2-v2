import { Router } from "express";
import { CourseController } from "./course.controller";
import requestValidation from "../../middlewares/requestValidation";
import { courseValidations } from "./course.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE_ENUM } from "../user/user.constant";

const router = Router();

router.get("/all-courses", CourseController.getAllCourses);
router.post(
  "/create-course",
  auth(USER_ROLE_ENUM.admin),
  requestValidation(courseValidations.createCourseSchemaValidation),
  CourseController.createCourse
);

router.put(
  "/update-course/:id",
  auth(USER_ROLE_ENUM.admin),
  requestValidation(courseValidations.updateCourseSchemaValidation),
  CourseController.updateCourse
);

router.get("/:id/reviews", CourseController.getCourseWithReviews);
router.get("/best-course", CourseController.getBestCourse);

export const CourseRoutes = router;
