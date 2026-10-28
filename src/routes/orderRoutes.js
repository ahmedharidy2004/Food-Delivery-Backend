import express from "express";
import { body } from "express-validator";
import * as orderController from "./../controllers/orderController.js";
import { protect } from "./../middleware/protect.js";
import { restrictTo } from "./../middleware/restrictTo.js";
import { validateInput } from "./../middleware/validateInput.js";

const router = express.Router();

router.use(protect);

router.route("/").post(
  validateInput([
    body("addressId").isUUID().withMessage("Valid addressId is required"),
    body("paymentMethod")
      .isIn(["CASH", "CREDIT_CARD", "STRIPE"])
      .withMessage("Payment method must be CASH, CREDIT_CARD, or STRIPE"),
  ]),
  orderController.createOrder,
);

router.get("/my-orders", orderController.getMyOrders);

router.get("/:id", orderController.getOrderById);

router.patch(
  "/:id/status",
  restrictTo("OWNER", "ADMIN"),
  validateInput([
    body("status")
      .isIn([
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ])
      .withMessage("Invalid order status"),
  ]),
  orderController.updateOrderStatus,
);

router.patch("/:id/cancel", orderController.cancelOrder);

export default router;
