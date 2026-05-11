import mongoose from "mongoose";
import Razorpay from "razorpay";
import Stripe from "stripe";

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { makeId, readDb, writeDb } from "../services/localStore.js";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const razorpayInstance =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID.trim(),
        key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
      })
    : null;

export const placeOrderCOD = async (req, res) => {
  try {
    const { items, amount, address } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const user = db.users.find((item) => item._id === req.userId);
      const order = {
        _id: makeId(),
        userId: req.userId,
        items,
        amount,
        address,
        status: "Order Placed",
        paymentMethod: "COD",
        payment: false,
        date: Date.now(),
      };

      db.orders.unshift(order);
      if (user) user.cartData = {};
      writeDb(db);

      return res.json({
        success: true,
        message: "Order Placed",
        order,
      });
    }

    const newOrder = new orderModel({
      userId: req.userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.userId, {
      cartData: {},
    });

    res.json({
      success: true,
      message: "Order Placed",
      order: newOrder,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const placeOrderStripe = async (req, res) => {
  try {
    if (!stripe) {
      return res.json({
        success: false,
        message: "Stripe secret key is not configured",
      });
    }

    const { items, amount, address } = req.body;

    const newOrder = new orderModel({
      userId: req.userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      success_url: `${req.headers.origin}/verify?success=true&orderid=${newOrder._id}`,
      cancel_url: `${req.headers.origin}/verify?success=false&orderid=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const placeOrderRazorpay = async (req, res) => {
  try {
    if (!razorpayInstance) {
      return res.json({
        success: false,
        message: "Razorpay keys are not configured",
      });
    }

    const { amount } = req.body;

    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_order",
    });

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const userOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const orders = readDb().orders.filter(
        (order) => order.userId === req.userId,
      );

      return res.json({
        success: true,
        orders,
      });
    }

    const orders = await orderModel.find({
      userId: req.userId,
    });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const allOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        orders: readDb().orders,
      });
    }

    const orders = await orderModel.find({});

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const order = db.orders.find((item) => item._id === req.body.orderId);

      if (!order) {
        return res.json({
          success: false,
          message: "Order not found",
        });
      }

      order.status = req.body.status;
      writeDb(db);

      return res.json({
        success: true,
        message: "Status Updated",
      });
    }

    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });

    res.json({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyStripe = async (req, res) => {
  try {
    const { success, orderid, orderId } = req.body;
    const id = orderid || orderId;

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const user = db.users.find((item) => item._id === req.userId);

      if (success === "true") {
        const order = db.orders.find((item) => item._id === id);
        if (order) order.payment = true;
        if (user) user.cartData = {};
        writeDb(db);

        return res.json({
          success: true,
        });
      }

      db.orders = db.orders.filter((item) => item._id !== id);
      writeDb(db);

      return res.json({
        success: false,
        message: "Payment was not completed",
      });
    }

    if (success === "true" && id) {
      await orderModel.findByIdAndUpdate(id, {
        payment: true,
      });

      await userModel.findByIdAndUpdate(req.userId, {
        cartData: {},
      });

      return res.json({
        success: true,
      });
    }

    if (id) {
      await orderModel.findByIdAndDelete(id);
    }

    res.json({
      success: false,
      message: "Payment was not completed",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
