import AppError from "./../utils/appError.js";
import prisma from "./../config/config.js";

export const createOrder = async (userId, addressId, paymentMethod) => {
  // check address existance and ownership
  const address = await prisma.address.findUnique({
    where: {
      id: addressId,
    },
  });

  if (!address) throw new AppError("Address not found!", 404);
  if (address.userId !== userId) throw new AppError("Not Allowed!", 403);

  // getting user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        include: { menuItem: true },
      },
    },
  });

  if (!cart || cart.cartItems.length === 0) {
    throw new AppError("Your cart is empty", 400);
  }

  // check every item is still available
  const unavailableItem = cart.cartItems.find(
    (item) => !item.menuItem.isAvailable,
  );
  if (unavailableItem) {
    throw new AppError(
      `${unavailableItem.menuItem.name} is no longer available`,
      400,
    );
  }

  // get total price of cart items and delivery fee
  const totalPrice = cart.cartItems.reduce(
    (sum, item) => sum + Number(item.menuItem.price) * item.quantity,
    0,
  );

  const deliveryFee = totalPrice * 0.05;
  const cost = totalPrice + deliveryFee;

  // transaction
  const result = await prisma.$transaction(async (tx) => {
    // creating order
    const order = await tx.order.create({
      data: {
        status: "PENDING",
        totalPrice: cost,
        deliveryFee: deliveryFee,
        paymentStatus: "PENDING",
        userId,
        addressId,
      },
    });

    // creating order items
    await tx.orderItem.createMany({
      data: cart.cartItems.map((item) => ({
        quantity: item.quantity,
        price: item.menuItem.price,
        orderId: order.id,
        menuItemId: item.menuItemId,
      })),
    });

    // create payment
    await tx.payment.create({
      data: {
        method: paymentMethod,
        amount: cost,
        orderId: order.id,
      },
    });

    // clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  });

  return result;
};

export const getMyOrders = async (userId) => {
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
  });

  return orders;
};

export const getOrderById = async (id, user) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: { menuItem: { include: { restaurant: true } } },
      },
    },
  });

  if (!order) throw new AppError("No Order Found", 404);

  const restaurant = order.orderItems[0]?.menuItem?.restaurant;
  const isOwner = order.userId === user.id;
  const isRestaurantOwner = restaurant && restaurant.ownerId === user.id;

  if (user.role !== "ADMIN" && !isOwner && !isRestaurantOwner) {
    throw new AppError("You are not allowed to view this order", 403);
  }

  return order;
};

const VALID_TRANSITIONS = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export const updateOrderStatus = async (orderId, newStatus, user) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          menuItem: {
            include: { restaurant: true },
          },
        },
      },
    },
  });

  if (!order) throw new AppError("Order not found!", 404);

  const restaurant = order.orderItems[0]?.menuItem?.restaurant;
  if (!restaurant) throw new AppError("Order has no items", 400);

  if (user.role !== "ADMIN" && restaurant.ownerId !== user.id)
    throw new AppError("You are not allowed to update this order", 403);

  const allowedNext = VALID_TRANSITIONS[order.status] || [];
  if (!allowedNext.includes(newStatus)) {
    throw new AppError(
      `Cannot change order status from ${order.status} to ${newStatus}`,
      400,
    );
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  return updatedOrder;
};

export const cancelOrder = async (orderId, user) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new AppError("Order not found!", 404);

  if (user.role !== "ADMIN" && order.userId !== user.id) {
    throw new AppError("You are not allowed to cancel this order", 403);
  }

  const allowedNext = VALID_TRANSITIONS[order.status] || [];
  if (!allowedNext.includes("CANCELLED")) {
    throw new AppError("Cannot change order status", 400);
  }

  const cancelledOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });

  return cancelledOrder;
};
