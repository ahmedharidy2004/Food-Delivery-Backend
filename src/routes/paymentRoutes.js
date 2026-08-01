import express from "express";
import * as paymentController from "./../controllers/paymentController.js";
import { protect } from "./../middleware/protect.js";
import { restrictTo } from "./../middleware/restrictTo.js";

const router = express.Router();

router.use(protect);

router.get("/:id", paymentController.getPaymentById);

router.patch(
  "/:id/status",
  restrictTo("ADMIN"),
  paymentController.updatePaymentStatus,
);

export default router;
