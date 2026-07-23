import catchAsync from "./../utils/catchAsync.js";
import * as authService from "./../services/authService.js";
import { signToken } from "./../utils/jwt.js";
import appError from "./../utils/appError.js";

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
  res.status(200).json({
    status: "success",
    resetToken,
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
