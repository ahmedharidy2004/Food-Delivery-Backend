import express from "express";
import * as orderController from "./../controllers/orderController.js";
import { protect } from "./../middleware/protect.js";
import { restrictTo } from "./../middleware/restrictTo.js";

const router = express.Router();

router.use(protect);

router.route("/").post(orderController.createOrder);

router.get("/my-orders", orderController.getMyOrders);

router.get("/:id", orderController.getOrderById);

router.patch(
  "/:id/status",
  restrictTo("OWNER", "ADMIN"),
  orderController.updateOrderStatus,
);

router.patch("/:id/cancel", orderController.cancelOrder);

export default router;
