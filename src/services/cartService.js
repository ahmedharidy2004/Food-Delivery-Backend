import appError from "./../utils/appError.js";
import prisma from "./../config/config.js";

// model Cart {
//   id String @id @default(uuid())

//   cartItems CartItem[]

//   userId String @unique
//   user User @relation(fields: [userId], references: [id])
// }

export const createCart = async (userId) => {
  const cart = await prisma.cart.create({
    data: {
      userId,
    },
  });

  return cart;
};

export const getCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      cartItems: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  if (!cart) throw new appError("Cart not found!", 404);
  return cart;
};

export const clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) throw new appError("Cart not found!", 404);
  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });
};

export const updateCartItem = async (itemId, quantity) => {
  if (quantity < 1) {
    throw new appError("Quantity must be greater than 0.", 400);
  }
  const updatedItem = await prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity,
    },
  });

  return updatedItem;
};

export const deleteCartItem = async (itemId, userId) => {
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId,
      },
    },
  });

  if (!item) {
    throw new appError("Cart item not found!", 404);
  }

  await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });
};

export const createCartItem = async (body, userId) => {
  const { quantity, menuItemId } = body;
  if (quantity < 1) {
    throw new appError("Quantity must be greater than 0.", 400);
  }

  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    throw new appError("Cart not found!", 404);
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_menuItemId: {
        cartId: cart.id,
        menuItemId,
      },
    },
  });

  if (existingItem) {
    return await prisma.cartItem.update({
      where: {
        cartId_menuItemId: {
          cartId: cart.id,
          menuItemId,
        },
      },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  }

  const createdItem = await prisma.cartItem.create({
    data: {
      quantity,
      menuItemId,
      cartId: cart.id,
    },
  });

  return createdItem;
};

export const getTotalPrice = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      cartItems: {
        include: {
          menuItem: {
            select: {
              price: true,
            },
          },
        },
      },
    },
  });

  if (!cart) throw new appError("Cart not found!", 404);

  const total = cart.cartItems.reduce((sum, item) => {
    return sum + Number(item.menuItem.price) * item.quantity;
  }, 0);

  return total;
};
