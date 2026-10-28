import express from "express";
import { body } from "express-validator";
import * as cartController from "./../controllers/cartController.js";
import { protect } from "./../middleware/protect.js";
import { validateInput } from "./../middleware/validateInput.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(cartController.getCart)
  .delete(cartController.clearCart)
  .post(cartController.createCart);

router.route("/items").post(
  validateInput([
    body("menuItemId").isUUID().withMessage("Valid menuItemId is required"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be an integer of at least 1"),
  ]),
  cartController.createCartItem,
);

router
  .route("/items/:id")
  .patch(
    validateInput([
      body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be an integer of at least 1"),
    ]),
    cartController.updateCartItem,
  )
  .delete(cartController.deleteCartItem);

router.route("/totalPrice").get(cartController.getTotalPrice);

export default router;
