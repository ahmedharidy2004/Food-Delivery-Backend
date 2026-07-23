import express from "express";
import AuthRoutes from "./src/routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use("/auth", AuthRoutes);

export default app;
