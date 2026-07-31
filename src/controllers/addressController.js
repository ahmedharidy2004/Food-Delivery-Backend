import catchAsync from "./../utils/catchAsync.js";
import * as addressService from "./../services/addressService.js";

export const createAddress = catchAsync(async (req, res) => {
  const createdAddress = await addressService.createAddress(
    req.body,
    req.user.id,
  );

  res.status(201).json({
    status: "success",
    data: {
      createdAddress,
    },
  });
});

export const getMyAddresses = catchAsync(async (req, res) => {
  const addresses = await addressService.getMyAddresses(req.user.id);

  res.status(200).json({
    status: "success",
    data: {
      addresses,
    },
  });
});

export const updateAddress = catchAsync(async (req, res) => {
  const updatedAddress = await addressService.updateAddress(
    req.params.id,
    req.user.id,
    req.body,
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedAddress,
    },
  });
});

export const deleteAddress = catchAsync(async (req, res) => {
  await addressService.deleteAddress(req.params.id, req.user.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
