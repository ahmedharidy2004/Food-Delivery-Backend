import prisma from "./../config/config.js";
import catchAsync from "./../utils/catchAsync.js";
import appError from "./../utils/appError.js";
import { verifyToken } from "./../utils/jwt.js";

export const protect = catchAsync(async (req, res, next) => {
  // check authorization header
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(
      new appError(
        "you are not authorized to perform the following action. please log in!",
        401,
      ),
    );
  }

  // check if the token is valid
  const token = req.headers.authorization.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return next(new appError("Invalid Token.", 401));
  }

  // check if user exists
  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });
  if (!user) {
    return next(new appError("User is no longer found!", 401));
  }

  req.user = user;
  next();
});
