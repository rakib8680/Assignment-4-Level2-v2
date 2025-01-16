import { Router } from "express";
import { reviewController } from "./review.controller";
import requestValidation from "../../middlewares/requestValidation";
import { reviewValidations } from "./review.validation";

const router = Router();

router.post(
  "/create-review",
  requestValidation(reviewValidations.createReviewValidationSchema),
  reviewController.createReview
);
router.get("/all-reviews", reviewController.getAllReviews);
router.delete("/delete-review/:id", reviewController.deleteReview);

export const ReviewRoutes = router;
