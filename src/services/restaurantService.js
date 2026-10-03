import appError from "./../utils/appError.js";
import prisma from "./../config/config.js";

//////////////////////////////
//  id String @id @default(uuid())
//   name String
//   description String
//   phoneNumber String
//   openingHours Json
//   rating Float
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   menuItems MenuItem[]
//   reviews Review[]

//   ownerId String
//   owner User @relation(fields: [ownerId], references: [id]
//////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export const getAllRestaurants = async () => {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      phoneNumber: true,
      openingHours: true,
      rating: true,
      owner: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
        },
      },
    },
  });
  return restaurants;
};

export const getRestaurantById = async (id) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      phoneNumber: true,
      openingHours: true,
      rating: true,
      owner: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
        },
      },
    },
  });

  if (!restaurant)
    throw new appError("There is no restaurant with that id!", 404);

  return restaurant;
};

export const createRestaurant = async (body, userId) => {
  const { name, description, phoneNumber, openingHours, rating } = body;

  const ownerId = userId;

  const createdRestaurant = await prisma.restaurant.create({
    data: {
      name: name,
      description: description,
      phoneNumber: phoneNumber,
      openingHours: openingHours,
      rating: rating,
      ownerId: ownerId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      phoneNumber: true,
      openingHours: true,
      rating: true,
      owner: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
        },
      },
    },
  });

  return createdRestaurant;
};

export const updateRestaurant = async (id, body, user) => {
  const { name, description, phoneNumber, openingHours, rating, ownerId } =
    body;

  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) throw new appError("Restaurant not found", 404);

  if (user.role !== "ADMIN" && restaurant.ownerId !== user.id) {
    throw new appError("You are not allowed to update this restaurant", 403);
  }

  const updatedRestaurant = await prisma.restaurant.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      description: description,
      phoneNumber: phoneNumber,
      openingHours: openingHours,
      rating: rating,
      ownerId: ownerId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      phoneNumber: true,
      openingHours: true,
      rating: true,
      owner: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
        },
      },
    },
  });

  return updatedRestaurant;
};

export const deleteRestaurant = async (userId, id) => {
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id
    },
    select: {
      ownerId: true
    }
  });

  if(!restaurant)
    throw new appError("Restaurant not found!", 404);

  if(userId !== restaurant.ownerId)
    throw new appError("you are not authorized to perform this action!", 403);
  
  await prisma.restaurant.delete({
    where: {
      id: id,
    },
  });
};
