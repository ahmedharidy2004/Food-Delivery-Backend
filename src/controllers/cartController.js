import catchAsync from "./../utils/catchAsync.js";
import * as cartService from "./../services/cartService.js";

export const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

export const clearCart = catchAsync(async (req, res) => {
  await cartService.clearCart(req.user.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const updateCartItem = catchAsync(async (req, res) => {
  const itemId = req.params.id;
  const { quantity } = req.body;

  const updatedItem = await cartService.updateCartItem(itemId, quantity);
  res.status(200).json({
    status: "success",
    data: {
      updatedItem,
    },
  });
});

export const deleteCartItem = catchAsync(async (req, res) => {
  await cartService.deleteCartItem(req.params.id, req.user.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const createCartItem = catchAsync(async (req, res) => {
  const createdItem = await cartService.createCartItem(req.body, req.user.id);

  res.status(201).json({
    status: "success",
    data: {
      createdItem,
    },
  });
});

export const getTotalPrice = catchAsync(async (req, res) => {
  const totalPrice = await cartService.getTotalPrice(req.user.id);

  res.status(200).json({
    status: "success",
    message: `total price of the items = ${totalPrice}`,
  });
});
