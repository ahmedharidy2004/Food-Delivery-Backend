import appError from "./../utils/appError.js";
import prisma from "./../config/config.js";
//////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// model MenuItem {
//   id String @id @default(uuid())
//   name String
//   description String
//   price Decimal
//   image String
//   isAvailable Boolean

//   orderItems OrderItem[]
//   cartItems CartItem[]

//   restaurantId String
//   restaurant Restaurant @relation(fields: [restaurantId], references:[id])
//   categoryId String
//   category Category @relation(fields: [categoryId], references:[id])
// }
/////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export const getAllMenuItems = async () => {
  const menuItems = await prisma.menuItem.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      isAvailable: true,
      restaurant: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return menuItems;
};

export const getMenuItemById = async (id) => {
  const menuItem = await prisma.menuItem.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      isAvailable: true,
      restaurant: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!menuItem) throw new appError("No menu item found with that id", 404);
  return menuItem;
};

export const createMenuItem = async (body, user) => {
  const {
    name,
    description,
    price,
    image,
    isAvailable,
    restaurantId,
    categoryId,
  } = body;

  // checks
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });

  if (!restaurant) throw new appError("Restaurant not found", 404);

  if (user.role !== "ADMIN" && restaurant.ownerId !== user.id) {
    throw new appError(
      "You are not allowed to add items to this restaurant",
      403,
    );
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) throw new appError("category not found", 404);

  const createdMenuItem = await prisma.menuItem.create({
    data: {
      name,
      description,
      price,
      image,
      isAvailable,
      restaurantId,
      categoryId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      isAvailable: true,
      restaurant: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return createdMenuItem;
};

export const updateMenuItem = async (id, body, user) => {
  const {
    name,
    description,
    price,
    image,
    isAvailable,
    restaurantId,
    categoryId,
  } = body;

  // checks
  if (restaurantId) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) throw new appError("Restaurant not found", 404);
  }

  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) throw new appError("Category not found", 404);
  }

  const menuItem = await prisma.menuItem.findUnique({
    where: { id },
    include: {
      restaurant: true,
    },
  });

  if (!menuItem) throw new appError("Menu item not found", 404);

  if (user.role !== "ADMIN" && menuItem.restaurant.ownerId !== user.id) {
    throw new appError("You are not allowed", 403);
  }

  const updatedMenuItem = await prisma.menuItem.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      price,
      image,
      isAvailable,
      restaurantId,
      categoryId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      isAvailable: true,
      restaurant: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return updatedMenuItem;
};

export const deleteMenuItem = async (id, user) => {
  // checks
  const menuItem = await prisma.menuItem.findUnique({
    where: { id },
    include: {
      restaurant: true,
    },
  });

  if (!menuItem) throw new appError("Menu item not found", 404);

  if (user.role !== "ADMIN" && menuItem.restaurant.ownerId !== user.id) {
    throw new appError("You are not allowed", 403);
  }

  await prisma.menuItem.delete({
    where: { id },
  });
};
