import express from "express";
import AuthRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use("/auth", AuthRoutes);
app.use("/users", userRoutes);

export default app;
