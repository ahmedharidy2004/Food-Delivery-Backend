import express from "express";
import * as cartController from "./../controllers/cartController.js";
import { protect } from "./../middleware/protect.js";

const router = express.Router();

router.use(protect);

router.route("/").get(cartController.getCart).delete(cartController.clearCart);

router.route("/items").post(cartController.createCartItem);

router
  .route("/items/:id")
  .patch(cartController.updateCartItem)
  .delete(cartController.deleteCartItem);

export default router;
