import { Router } from "express";
import { CourseController } from "./course.controller";
import requestValidation from "../../middlewares/requestValidation";
import { courseValidations } from "./course.validation";

const router = Router();

router.get("/all-courses", CourseController.getAllCourses);
router.post(
  "/create-course",
  requestValidation(courseValidations.createCourseSchemaValidation),
  CourseController.createCourse
);

router.put(
  "/update-course/:id",
  requestValidation(courseValidations.updateCourseSchemaValidation),
  CourseController.updateCourse
);

router.get("/:id/reviews", CourseController.getCourseWithReviews);
router.get("/best-course", CourseController.getBestCourse);

export const CourseRoutes = router;
