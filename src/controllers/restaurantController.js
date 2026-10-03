import * as restaurantService from "./../services/restaurantService.js";
import catchAsync from "./../utils/catchAsync.js";

export const getAllRestaurants = catchAsync(async (req, res) => {
  const restaurants = await restaurantService.getAllRestaurants();

  res.status(200).json({
    status: "success",
    results: restaurants.length,
    data: {
      restaurants,
    },
  });
});

export const getRestaurantById = catchAsync(async (req, res) => {
  const restaurant = await restaurantService.getRestaurantById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      restaurant,
    },
  });
});

export const createRestaurant = catchAsync(async (req, res) => {
  const CreatedRestaurant = await restaurantService.createRestaurant(
    req.body,
    req.user.id,
  );

  res.status(201).json({
    status: "success",
    data: {
      CreatedRestaurant,
    },
  });
});

export const updateRestaurant = catchAsync(async (req, res) => {
  const updatedRestaurant = await restaurantService.updateRestaurant(
    req.params.id,
    req.body,
    req.user,
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedRestaurant,
    },
  });
});

export const deleteRestaurant = catchAsync(async (req, res) => {
  await restaurantService.deleteRestaurant(req.user.id,req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
