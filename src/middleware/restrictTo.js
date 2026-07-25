import appError from "./../utils/appError.js";

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("your role does not let you perform this action!", 401),
      );
    }

    next();
  };
};
