import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import appError from "./../utils/appError.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
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

export const createRestaurant = async (body) => {
  const { name, description, phoneNumber, openingHours, rating, ownerId } =
    body;

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

export const updateRestaurant = async (id, body) => {
  const { name, description, phoneNumber, openingHours, rating, ownerId } =
    body;

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

export const deleteRestaurant = async (id) => {
  await prisma.restaurant.delete({
    where: {
      id: id,
    },
  });
};
