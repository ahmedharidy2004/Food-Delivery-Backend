import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import appError from "./../utils/appError.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

////////////////////////////// Admin functions \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
    },
  });

  return users;
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
    },
  });

  if (!user) {
    throw new appError("There is no user with that id!", 404);
  }

  return user;
};

export const updateUser = async (id, body) => {
  const { name, email, phoneNumber, role } = body;
  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      role: role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
    },
  });

  return updatedUser;
};

export const deleteUser = async (id) => {
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      isActive: false,
    },
  });
};

/////////////////////// user functions \\\\\\\\\\\\\\\\\\\\\\\\\\
export const getMe = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phoneNumber: true,
    },
  });
};

export const updateMe = async (id, body) => {
  const { name, email, phoneNumber } = body;
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phoneNumber: true,
    },
  });
};

export const deleteMe = async (id) => {
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      isActive: false,
    },
  });
};
