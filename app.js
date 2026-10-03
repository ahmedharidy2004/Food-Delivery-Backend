import express from "express";
import rateLimit from "express-rate-limit";
import AuthRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import restaurantRoutes from "./src/routes/restaurantRoutes.js";
import menuRoutes from "./src/routes/menuRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import addressRoutes from "./src/routes/addressRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import AppError from "./src/utils/appError.js";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  handler: (req, res, next) => {
    next(new AppError("Too many requests, please try again later.", 429));
  },
});

app.use(limiter);

app.use(express.json());
app.use("/auth", AuthRoutes);
app.use("/users", userRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/menuItems", menuRoutes);
app.use("/cart", cartRoutes);
app.use("/addresses", addressRoutes);
app.use("/reviews", reviewRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);

// adding global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.isOperational ? err.message : "Something went wrong!",
  });
});


export default app;
