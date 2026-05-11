import express from "express";

import authUser from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js";

import {
  getStats,
  getDailySummary,
  getTopProducts,
} from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", authUser, adminAuth, getStats);

dashboardRouter.post("/stats", authUser, adminAuth, getStats);

dashboardRouter.post("/daily-summary", authUser, adminAuth, getDailySummary);

dashboardRouter.post("/top-products", authUser, adminAuth, getTopProducts);

export default dashboardRouter;
