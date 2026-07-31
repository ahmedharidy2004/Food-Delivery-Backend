import catchAsync from "./../utils/catchAsync.js";
import * as reviewService from "./../services/reviewService.js";

export const createReview = catchAsync(async (req, res) => {
  const createdReview = await reviewService.createReview(
    req.user.id,
    req.params.restaurantId,
    req.body,
  );

  res.status(201).json({
    status: "success",
    data: { createdReview },
  });
});

export const getRestaurantReviews = catchAsync(async (req, res) => {
  const reviews = await reviewService.getRestaurantReviews(
    req.params.restaurantId,
  );

  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
});

export const updateReview = catchAsync(async (req, res) => {
  const updatedReview = await reviewService.updateReview(
    req.params.id,
    req.user.id,
    req.body,
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedReview,
    },
  });
});

export const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReview(req.params.id, req.user);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
