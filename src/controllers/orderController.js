import catchAsync from "./../utils/catchAsync.js";
import * as orderService from "./../services/orderService.js";

export const createOrder = catchAsync(async (req, res) => {
  const { addressId, paymentMethod } = req.body;

  const order = await orderService.createOrder(
    req.user.id,
    addressId,
    paymentMethod,
  );

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

export const getMyOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user.id);

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

export const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user);

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const updatedOrder = await orderService.updateOrderStatus(
    req.params.id,
    req.body.status,
    req.user,
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedOrder,
    },
  });
});

export const cancelOrder = catchAsync(async (req, res) => {
  const cancelledOrder = await orderService.cancelOrder(
    req.params.id,
    req.user,
  );

  res.status(200).json({
    status: "success",
    data: {
      cancelledOrder,
    },
  });
});
