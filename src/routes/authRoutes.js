import express from "express";
import * as authController from "./../controllers/authController.js";
import { protect } from "./../middleware/protect.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.patch("/updatePassword", protect, authController.updatePassword);
router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

export default router;
