import express from "express";
import rateLimit from "express-rate-limit";
import * as authController from "./../controllers/authController.js";
import { protect } from "./../middleware/protect.js";
import { validateInput } from "./../middleware/validateInput.js";
import { body } from "express-validator";
import AppError from "./../utils/appError.js";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  handler: (req, res, next) => {
    next(new AppError("Too many requests, please try again later.", 429));
  },
});

router.use(limiter);

router.post(
  "/signup",
  validateInput([
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  ]),
  authController.signup,
);

router.post(
  "/login",
  validateInput([
    body("email").isEmail().withMessage("Please provide a valid email!"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("password must be at least 8 chars."),
  ]),
  authController.login,
);

router.patch("/updatePassword", protect, authController.updatePassword);
router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

export default router;
