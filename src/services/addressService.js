import AppError from "./../utils/appError.js";
import prisma from "./../config/config.js";

export const createAddress = async (body, userId) => {
  const { street, city, country, zipCode } = body;
  const address = await prisma.address.create({
    data: {
      street,
      city,
      country,
      zipCode,
      userId,
    },
  });

  return address;
};

export const getMyAddresses = async (userId) => {
  const address = await prisma.address.findMany({
    where: {
      userId,
    },
  });

  return address;
};

export const updateAddress = async (id, userId, body) => {
  const address = await prisma.address.findUnique({
    where: {
      id,
    },
  });

  if (!address) throw new AppError("Address not found!", 404);
  if (address.userId !== userId) throw new AppError("Not Authorized", 403);

  const { street, city, country, zipCode } = body;

  const updatedAddress = await prisma.address.update({
    where: {
      id,
    },
    data: {
      street,
      city,
      country,
      zipCode,
    },
  });

  return updatedAddress;
};

export const deleteAddress = async (id, userId) => {
  const address = await prisma.address.findUnique({
    where: {
      id,
    },
  });

  if (!address) throw new AppError("Address not found!", 404);
  if (address.userId !== userId) throw new AppError("Not Authorized", 403);

  await prisma.address.delete({
    where: {
      id,
    },
  });
};
