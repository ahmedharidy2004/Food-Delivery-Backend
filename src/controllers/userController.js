import * as userService from "./../services/userService.js";
import catchAsync from "./../utils/catchAsync.js";

/////////////////////// Admin functions \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json({
    success: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

export const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);
  res.status(201).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

////////////////////// user functions \\\\\\\\\\\\\\\\\\\\\\\\\\
export const getMe = catchAsync(async (req, res) => {
  const user = await userService.getMe(req.user.id);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const updateMe = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateMe(req.user.id, req.body);
  res.status(201).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res) => {
  await userService.deleteMe(req.user.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
