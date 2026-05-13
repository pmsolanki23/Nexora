import express from "express";

import authUser from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js";

import {
  placeOrderCOD,
  placeOrderStripe,
  placeOrderRazorpay,
  verifyRazorpay,
  verifyStripe,
  userOrders,
  allOrders,
  updateStatus,
  razorpayWebhook,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Webhook must be before auth middleware (no token)
orderRouter.post("/razorpay/webhook", express.raw({ type: "application/json" }), razorpayWebhook);

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.post("/place", authUser, placeOrderCOD);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);
orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay);
orderRouter.post("/verifyStripe", authUser, verifyStripe);
orderRouter.post("/userorders", authUser, userOrders);
orderRouter.post("/list", authUser, adminAuth, allOrders);
orderRouter.post("/status", authUser, adminAuth, updateStatus);

export default orderRouter;
