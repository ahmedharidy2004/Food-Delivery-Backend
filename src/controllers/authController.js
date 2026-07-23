import catchAsync from "./../utils/catchAsync.js";
import * as authService from "./../services/authService.js";
import { signToken } from "./../utils/jwt.js";

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

export const login = catchAsync(async (req, res, next) => {
  const user = await authService.login(req.body, next);

  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    token,
  });
});
