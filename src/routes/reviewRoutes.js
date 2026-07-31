import express from "express";
import * as reviewController from "./../controllers/reviewController.js";
import { protect } from "./../middleware/protect.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getRestaurantReviews)
  .post(protect, reviewController.createReview);

router
  .route("/:id")
  .patch(protect, reviewController.updateReview)
  .delete(protect, reviewController.deleteReview);

export default router;
