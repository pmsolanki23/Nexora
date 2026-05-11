import express from "express";

import authUser from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js";

import {
  placeOrderCOD,
  placeOrderStripe,
  placeOrderRazorpay,
  verifyStripe,
  userOrders,
  allOrders,
  updateStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);

orderRouter.post("/place", authUser, placeOrderCOD);

orderRouter.post("/stripe", authUser, placeOrderStripe);

orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

orderRouter.post("/verifyStripe", authUser, verifyStripe);

orderRouter.post("/userorders", authUser, userOrders);

orderRouter.post("/list", authUser, adminAuth, allOrders);

orderRouter.post("/status", authUser, adminAuth, updateStatus);

export default orderRouter;
