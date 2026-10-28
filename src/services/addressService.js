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

  const updateData = {};
  if (street !== undefined) updateData.street = street;
  if (city !== undefined) updateData.city = city;
  if (country !== undefined) updateData.country = country;
  if (zipCode !== undefined) updateData.zipCode = zipCode;

  const updatedAddress = await prisma.address.update({
    where: {
      id,
    },
    data: updateData,
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

  // Check if address is referenced in any existing orders
  const linkedOrder = await prisma.order.findFirst({
    where: {
      addressId: id,
    },
  });

  if (linkedOrder) {
    throw new AppError(
      "Cannot delete this address because it is associated with existing orders. You can update its details instead.",
      400,
    );
  }

  await prisma.address.delete({
    where: {
      id,
    },
  });
};
