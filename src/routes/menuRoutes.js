import express from "express";
import { body } from "express-validator";
import * as menuController from "./../controllers/menuController.js";
import { protect } from "./../middleware/protect.js";
import { restrictTo } from "./../middleware/restrictTo.js";
import { validateInput } from "./../middleware/validateInput.js";

const router = express.Router();

router
  .route("/")
  .get(menuController.getAllMenuItems)
  .post(
    protect,
    restrictTo("OWNER", "ADMIN"),
    validateInput([
      body("name").trim().notEmpty().withMessage("Menu item name is required"),
      body("description").trim().notEmpty().withMessage("Description is required"),
      body("price")
        .isFloat({ min: 0.01 })
        .withMessage("Price must be a positive number"),
      body("image").trim().notEmpty().withMessage("Image URL is required"),
      body("isAvailable")
        .isBoolean()
        .withMessage("isAvailable must be a boolean"),
      body("restaurantId")
        .isUUID()
        .withMessage("Valid restaurantId is required"),
      body("categoryId").isUUID().withMessage("Valid categoryId is required"),
    ]),
    menuController.createMenuItem,
  );

router
  .route("/:id")
  .get(menuController.getMenuItemById)
  .patch(
    protect,
    restrictTo("OWNER", "ADMIN"),
    validateInput([
      body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Menu item name cannot be empty"),
      body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty"),
      body("price")
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage("Price must be a positive number"),
      body("image")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Image cannot be empty"),
      body("isAvailable")
        .optional()
        .isBoolean()
        .withMessage("isAvailable must be a boolean"),
      body("restaurantId")
        .optional()
        .isUUID()
        .withMessage("Valid restaurantId is required"),
      body("categoryId")
        .optional()
        .isUUID()
        .withMessage("Valid categoryId is required"),
    ]),
    menuController.updateMenuItem,
  )
  .delete(protect, restrictTo("OWNER", "ADMIN"), menuController.deleteMenuItem);

export default router;
