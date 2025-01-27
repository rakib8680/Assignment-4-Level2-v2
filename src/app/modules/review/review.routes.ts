import { Router } from "express";
import { reviewController } from "./review.controller";
import requestValidation from "../../middlewares/requestValidation";
import { reviewValidations } from "./review.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE_ENUM } from "../user/user.constant";

const router = Router();

router.post(
  "/create-review",
  auth(USER_ROLE_ENUM.user),
  requestValidation(reviewValidations.createReviewValidationSchema),
  reviewController.createReview
);
router.get("/all-reviews", reviewController.getAllReviews);
router.delete(
  "/delete-review/:id",
  auth(USER_ROLE_ENUM.user),
  reviewController.deleteReview
);

export const ReviewRoutes = router;
