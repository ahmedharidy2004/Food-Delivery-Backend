import { validationResult } from "express-validator";
import AppError from "./../utils/appError.js";

export const validateInput = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const message = errors
        .array()
        .map((error) => error.msg)
        .join(", ");

      return next(new AppError(message, 400));
    }

    next();
  };
};
