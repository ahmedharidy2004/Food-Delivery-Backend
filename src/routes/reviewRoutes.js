import express from "express";
import { body } from "express-validator";
import * as reviewController from "./../controllers/reviewController.js";
import { protect } from "./../middleware/protect.js";
import { validateInput } from "./../middleware/validateInput.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getRestaurantReviews)
  .post(
    protect,
    validateInput([
      body("rating")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be an integer between 1 and 5"),
      body("comment").trim().notEmpty().withMessage("Comment is required"),
    ]),
    reviewController.createReview,
  );

router
  .route("/:id")
  .patch(
    protect,
    validateInput([
      body("rating")
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be an integer between 1 and 5"),
      body("comment")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Comment cannot be empty"),
    ]),
    reviewController.updateReview,
  )
  .delete(protect, reviewController.deleteReview);

export default router;
