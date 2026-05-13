import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import { uploadDir } from "./services/localStore.js";
import connectDB from "./config/db.js";

import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import searchRouter from "./routes/searchRoutes.js";

const app = express();

connectDB();

// =========================
// SECURITY MIDDLEWARE
// =========================

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// General rate limiter: 100 req / 15 min
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

// Auth rate limiter: 10 req / 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many auth attempts, please try again later." },
});

app.use(generalLimiter);

// =========================
// BODY PARSING
// =========================

// Webhook route needs raw body — register before express.json()
app.use("/api/order/razorpay/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// CORS
// =========================

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// =========================
// OTHER MIDDLEWARE
// =========================

app.use(cookieParser());
app.use(morgan("dev"));

// MongoDB injection sanitization
app.use(mongoSanitize());

// Static uploads
app.use("/uploads", express.static(uploadDir));

// =========================
// ROUTES
// =========================

app.get("/", (req, res) => {
  res.json({ success: true, message: "Nexora API Running" });
});

// Auth rate limiting on auth endpoints
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/user", authRouter);

app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/review", reviewRouter);
app.use("/api/search", searchRouter);

// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Nexora Server Running on port ${PORT}`);
});
