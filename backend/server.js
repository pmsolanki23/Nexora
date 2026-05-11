import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { uploadDir } from "./services/localStore.js";

import connectDB from "./config/db.js";

import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";

const app = express();

connectDB();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(morgan("dev"));
app.use("/uploads", express.static(uploadDir));

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.use("/api/auth", authRouter);
app.use("/api/user", authRouter);

app.use("/api/product", productRouter);

app.use("/api/cart", cartRouter);

app.use("/api/order", orderRouter);

app.use("/api/dashboard", dashboardRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server Running ${PORT}`);
});
