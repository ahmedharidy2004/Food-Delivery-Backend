import express from "express";
import AuthRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import restaurantRoutes from "./src/routes/restaurantRoutes.js";
import menuRoutes from "./src/routes/menuRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import addressRoutes from "./src/routes/addressRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";

const app = express();

app.use(express.json());
app.use("/auth", AuthRoutes);
app.use("/users", userRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/menuItems", menuRoutes);
app.use("/cart", cartRoutes);
app.use("/addresses", addressRoutes);
app.use("/reviews", reviewRoutes);

export default app;
