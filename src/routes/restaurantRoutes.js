import * as restaurantController from "./../controllers/restaurantController.js";
import { protect } from "./../middleware/protect.js";
import { restrictTo } from "./../middleware/restrictTo.js";
import express from "express";

const router = express.Router();

router
  .route("/")
  .get(restaurantController.getAllRestaurants)
  .post(
    protect,
    restrictTo("ADMIN", "OWNER"),
    restaurantController.createRestaurant,
  );

router
  .route("/:id")
  .get(restaurantController.getRestaurantById)
  .patch(
    protect,
    restrictTo("ADMIN", "OWNER"),
    restaurantController.updateRestaurant,
  )
  .delete(protect, restrictTo("ADMIN"), restaurantController.deleteRestaurant);

export default router;
