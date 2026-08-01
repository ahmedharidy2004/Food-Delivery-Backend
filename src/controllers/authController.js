import catchAsync from "./../utils/catchAsync.js";
import * as authService from "./../services/authService.js";
import { signToken } from "./../utils/jwt.js";
import appError from "./../utils/appError.js";
import sendEmail from "./../utils/email.js";

export const signup = catchAsync(async (req, res) => {
  const user = await authService.signup(req.body);
  const token = signToken(user.id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const user = await authService.login(req.body);

  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    token,
  });
});

export const updatePassword = catchAsync(async (req, res) => {
  const updatedUser = await authService.updatePassword(req.body, req.user);

  res.status(201).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});

export const forgetPassword = catchAsync(async (req, res) => {
  if (!req.body.email) {
    throw new appError("can not leave email empty!", 400);
  }

  const resetToken = await authService.forgetPassword(req.body.email);
  const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

  await sendEmail({
    email: req.body.email,
    subject: "Your password reset token (valid for 10 minutes)",
    message: `Forgot your password? Click the link to reset it: ${resetURL}\nIf you didn't request this, please ignore this email.`,
  });

  res.status(200).json({
    status: "success",
    message: "reset URL sent to the email!",
  });
});

export const resetPassword = catchAsync(async (req, res) => {
  const token = req.params.token;
  const password = req.body.password;

  if (!password) throw new appError("empty password sent", 400);

  await authService.resetPassword(token, password);
  res.status(201).json({
    status: "success",
    message: "password changed successfully!",
  });
});
