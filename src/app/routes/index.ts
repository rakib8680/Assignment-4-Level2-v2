import { Router } from "express";
import { CourseRoutes } from "../modules/course/course.routes";
import { CategoryRoutes } from "../modules/category/category.routes";
import { ReviewRoutes } from "../modules/review/review.routes";

const router = Router();

const moduleRoues = [
  {
    path: "/course",
    route: CourseRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path:"/review",
    route : ReviewRoutes
  }
];

moduleRoues.forEach((route) => router.use(route.path, route.route));

export default router;
