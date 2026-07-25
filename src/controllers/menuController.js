import catchAsync from "./../utils/catchAsync.js";
import * as menuService from "./../services/menuService.js";

export const getAllMenuItems = catchAsync(async (req, res) => {
  const menuItems = await menuService.getAllMenuItems();

  res.status(200).json({
    status: "success",
    results: menuItems.length,
    data: {
      menuItems,
    },
  });
});

export const getMenuItemById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const menuItem = await menuService.getMenuItemById(id);

  res.status(200).json({
    status: "success",
    data: {
      menuItem,
    },
  });
});

export const createMenuItem = catchAsync(async (req, res) => {
  const createdMenuItem = await menuService.createMenuItem(req.body);

  res.status(201).json({
    status: "success",
    data: {
      menuItem: createdMenuItem,
    },
  });
});

export const updateMenuItem = catchAsync(async (req, res) => {
  const updatedMenuItem = await menuService.updateMenuItem(
    req.params.id,
    req.body,
    req.user.id,
  );

  res.status(200).json({
    status: "success",
    data: {
      menuItem: updatedMenuItem,
    },
  });
});

export const deleteMenuItem = catchAsync(async (req, res) => {
  await menuService.deleteMenuItem(req.params.id, req.user.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
