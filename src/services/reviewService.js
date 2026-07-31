import AppError from "./../utils/appError.js";
import prisma from "./../config/config.js";

export const createReview = async (userId, restaurantId, body) => {
  // check if restaurant found
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) throw new AppError("Restaurant Not Found", 404);

  const { rating, comment } = body;

  if (rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }

  const createdReview = await prisma.review.create({
    data: {
      rating,
      comment,
      userId,
      restaurantId,
    },
  });

  return createdReview;
};

export const getRestaurantReviews = async (restaurantId) => {
  const reviews = await prisma.review.findMany({
    where: {
      restaurantId,
    },
  });

  return reviews;
};

export const updateReview = async (id, userId, body) => {
  // check ownership
  const review = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!review) throw new AppError("review not found", 404);
  if (review.userId !== userId) throw new AppError("Not Allowed", 403);

  const { rating, comment } = body;

  if (rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }

  const updatedReview = await prisma.review.update({
    where: {
      id,
    },
    data: {
      rating,
      comment,
    },
  });

  return updatedReview;
};

export const deleteReview = async (id, user) => {
  // check ownership
  const review = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!review) throw new AppError("review not found", 404);
  if (user.role !== "ADMIN" && review.userId !== user.id)
    throw new AppError("Not Allowed", 403);

  await prisma.review.delete({
    where: {
      id,
    },
  });
};
