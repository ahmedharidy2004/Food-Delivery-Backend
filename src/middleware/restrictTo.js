import appError from "./../utils/appError";

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("you are not authorized to perform this action!", 401),
      );
    }

    next();
  };
};
