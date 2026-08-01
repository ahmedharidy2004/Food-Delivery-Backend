import AppError from "./../utils/appError.js";
import prisma from "./../config/config.js";

export const getPaymentById = async (id, user) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id,
    },
    include: { order: true },
  });

  if (!payment) throw new AppError("payment not found", 404);
  if (user.role !== "ADMIN" && payment.order.userId !== user.id)
    throw new AppError("Not Authorized", 403);

  return payment;
};

const VALID_PAYMENT_TRANSITIONS = {
  PENDING: ["PAID", "FAILED"],
  PAID: ["REFUNDED"],
  FAILED: ["PENDING"],
  REFUNDED: [],
};

export const updatePaymentStatus = async (id, newStatus, user) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
  });

  if (!payment) throw new AppError("Payment not found!", 404);

  if (user.role !== "ADMIN") {
    throw new AppError("You are not allowed to update this payment", 403);
  }

  const allowedNext = VALID_PAYMENT_TRANSITIONS[payment.status] || [];
  if (!allowedNext.includes(newStatus)) {
    throw new AppError(
      `Cannot change payment status from ${payment.status} to ${newStatus}`,
      400,
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id },
      data: { status: newStatus },
    });

    await tx.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: newStatus },
    });

    return updatedPayment;
  });

  return result;
};
