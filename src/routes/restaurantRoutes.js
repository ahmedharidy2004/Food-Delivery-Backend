import express from "express";
import { body } from "express-validator";
import * as restaurantController from "./../controllers/restaurantController.js";
import { protect } from "./../middleware/protect.js";
import { restrictTo } from "./../middleware/restrictTo.js";
import { validateInput } from "./../middleware/validateInput.js";
import reviewRouter from "./reviewRoutes.js";

const router = express.Router();

router.use("/:restaurantId/reviews", reviewRouter);

router
  .route("/")
  .get(restaurantController.getAllRestaurants)
  .post(
    protect,
    restrictTo("ADMIN", "OWNER"),
    validateInput([
      body("name").trim().notEmpty().withMessage("Restaurant name is required"),
      body("description").trim().notEmpty().withMessage("Description is required"),
      body("phoneNumber").trim().notEmpty().withMessage("Phone number is required"),
      body("openingHours").notEmpty().withMessage("Opening hours are required"),
      body("rating")
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage("Rating must be between 0 and 5"),
    ]),
    restaurantController.createRestaurant,
  );

router
  .route("/:id")
  .get(restaurantController.getRestaurantById)
  .patch(
    protect,
    restrictTo("ADMIN", "OWNER"),
    validateInput([
      body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Restaurant name cannot be empty"),
      body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty"),
      body("phoneNumber")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Phone number cannot be empty"),
      body("openingHours")
        .optional()
        .notEmpty()
        .withMessage("Opening hours cannot be empty"),
    ]),
    restaurantController.updateRestaurant,
  )
  .delete(protect, restrictTo("ADMIN"), restaurantController.deleteRestaurant);

export default router;
