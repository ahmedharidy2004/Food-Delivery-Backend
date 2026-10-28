import AppError from "./appError.js";

const handlePrismaError = (err) => {
  if (err.code === "P2002") {
    const fields = Array.isArray(err.meta?.target)
      ? err.meta.target.join(", ")
      : err.meta?.target || "field";
    return new AppError(
      `Duplicate value for field '${fields}'. Please use another value.`,
      409,
    );
  }

  if (err.code === "P2003") {
    return new AppError(
      "Operation failed because the record is referenced by other resources.",
      400,
    );
  }

  if (err.code === "P2025") {
    return new AppError(
      err.meta?.cause || "The requested record was not found.",
      404,
    );
  }

  if (err.code === "P2000") {
    return new AppError(
      "The provided value is too long for one or more fields.",
      400,
    );
  }

  return err;
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Intercept and transform known database / Prisma errors
  if (error.code && String(error.code).startsWith("P")) {
    error = handlePrismaError(error);
  }

  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  res.status(statusCode).json({
    status,
    message: error.isOperational ? error.message : "Something went wrong!",
  });
};

export default errorHandler;
