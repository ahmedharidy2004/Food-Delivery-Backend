import catchAsync from "./../utils/catchAsync.js";
import * as paymentService from "./../services/paymentService.js";

export const getPaymentById = catchAsync(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id, req.user);

  res.status(200).json({
    status: "success",
    data: {
      payment,
    },
  });
});

export const updatePaymentStatus = catchAsync(async (req, res) => {
  const updatedPayment = await paymentService.updatePaymentStatus(
    req.params.id,
    req.body.status,
    req.user,
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedPayment,
    },
  });
});
