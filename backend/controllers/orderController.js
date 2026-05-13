import crypto from "crypto";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import Stripe from "stripe";

import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
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

// =========================
// HELPER: Decrement stock
// =========================

const decrementStock = async (items) => {
  for (const item of items) {
    const productId = item._id;
    const size = item.size;
    const qty = item.quantity || 1;

    if (!productId || !size) continue;

    try {
      const product = await productModel.findById(productId);
      if (!product) continue;

      if (product.variants && product.variants.length > 0 && item.color) {
        const variant = product.variants.find(
          (v) => v.color.toLowerCase() === item.color.toLowerCase(),
        );
        if (variant && variant.stock) {
          const current = variant.stock.get(size) || 0;
          variant.stock.set(size, Math.max(0, current - qty));
        }
      } else if (product.stock) {
        const current = product.stock.get(size) || 0;
        product.stock.set(size, Math.max(0, current - qty));
      }

      // Recompute total
      let total = 0;
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((v) => {
          if (v.stock) v.stock.forEach((q) => { total += q || 0; });
        });
      } else if (product.stock) {
        product.stock.forEach((q) => { total += q || 0; });
      }

      product.totalStock = total;
      const threshold = product.lowStockThreshold || 5;
      product.lowStock = total > 0 && total <= threshold;

      await product.save();
    } catch (_) {
      // Non-critical stock update failure — don't block order
    }
  }
};

// =========================
// HELPER: Increment stock (on cancel)
// =========================

const incrementStock = async (items) => {
  for (const item of items) {
    const productId = item._id;
    const size = item.size;
    const qty = item.quantity || 1;

    if (!productId || !size) continue;

    try {
      const product = await productModel.findById(productId);
      if (!product) continue;

      if (product.variants && product.variants.length > 0 && item.color) {
        const variant = product.variants.find(
          (v) => v.color.toLowerCase() === item.color.toLowerCase(),
        );
        if (variant && variant.stock) {
          const current = variant.stock.get(size) || 0;
          variant.stock.set(size, current + qty);
        }
      } else if (product.stock) {
        const current = product.stock.get(size) || 0;
        product.stock.set(size, current + qty);
      }

      let total = 0;
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((v) => {
          if (v.stock) v.stock.forEach((q) => { total += q || 0; });
        });
      } else if (product.stock) {
        product.stock.forEach((q) => { total += q || 0; });
      }

      product.totalStock = total;
      const threshold = product.lowStockThreshold || 5;
      product.lowStock = total > 0 && total <= threshold;

      await product.save();
    } catch (_) {}
  }
};

// =========================
// PLACE ORDER — COD
// =========================

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

      return res.json({ success: true, message: "Order Placed", order });
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
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    // Decrement stock
    decrementStock(items);

    res.json({ success: true, message: "Order Placed", order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// PLACE ORDER — STRIPE
// =========================

export const placeOrderStripe = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(400).json({
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
        product_data: { name: item.name },
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

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// PLACE ORDER — RAZORPAY
// =========================

export const placeOrderRazorpay = async (req, res) => {
  try {
    if (!razorpayInstance) {
      return res.status(400).json({
        success: false,
        message: "Razorpay keys are not configured",
      });
    }

    const { items, amount, address } = req.body;

    // Create Razorpay order first
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save our order with razorpayOrderId
    const newOrder = new orderModel({
      userId: req.userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    res.json({
      success: true,
      order: razorpayOrder,
      orderId: newOrder._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// VERIFY RAZORPAY
// =========================

export const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    // HMAC verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(razorpay_signature, "hex"),
    );

    if (!isValid) {
      // Delete pending order
      if (orderId) {
        await orderModel.findByIdAndDelete(orderId);
      }
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Find order by our DB id or razorpay order id
    let order = null;
    if (orderId) {
      order = await orderModel.findById(orderId);
    }
    if (!order) {
      order = await orderModel.findOne({ razorpayOrderId: razorpay_order_id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Mark as paid
    order.payment = true;
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    // Clear cart
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    // Decrement stock
    decrementStock(order.items);

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// RAZORPAY WEBHOOK
// =========================

export const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret) {
      const signature = req.headers["x-razorpay-signature"];
      const body = JSON.stringify(req.body);
      const expectedSig = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");

      if (signature !== expectedSig) {
        return res.status(400).json({ success: false, message: "Invalid webhook signature" });
      }
    }

    const event = req.body;

    if (event.event === "payment.captured") {
      const razorpayOrderId = event.payload?.payment?.entity?.order_id;
      if (razorpayOrderId) {
        const order = await orderModel.findOne({ razorpayOrderId });
        if (order && !order.payment) {
          order.payment = true;
          order.razorpayPaymentId = event.payload?.payment?.entity?.id;
          await order.save();
          await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
          decrementStock(order.items);
        }
      }
    }

    if (event.event === "payment.failed") {
      const razorpayOrderId = event.payload?.payment?.entity?.order_id;
      if (razorpayOrderId) {
        await orderModel.findOneAndDelete({ razorpayOrderId, payment: false });
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// USER ORDERS
// =========================

export const userOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const orders = readDb().orders.filter((order) => order.userId === req.userId);
      return res.json({ success: true, orders });
    }

    const orders = await orderModel.find({ userId: req.userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// ALL ORDERS (Admin)
// =========================

export const allOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, orders: readDb().orders });
    }

    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// UPDATE STATUS (Admin)
// =========================

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const order = db.orders.find((item) => item._id === orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      order.status = status;
      writeDb(db);
      return res.json({ success: true, message: "Status Updated" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const prevStatus = order.status;
    order.status = status;
    await order.save();

    // If cancelled, restore stock
    if (status === "Cancelled" && prevStatus !== "Cancelled") {
      incrementStock(order.items);
    }

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// VERIFY STRIPE
// =========================

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
        return res.json({ success: true });
      }

      db.orders = db.orders.filter((item) => item._id !== id);
      writeDb(db);
      return res.json({ success: false, message: "Payment was not completed" });
    }

    if (success === "true" && id) {
      const order = await orderModel.findByIdAndUpdate(
        id,
        { payment: true },
        { new: true },
      );
      await userModel.findByIdAndUpdate(req.userId, { cartData: {} });
      if (order) decrementStock(order.items);
      return res.json({ success: true });
    }

    if (id) {
      await orderModel.findByIdAndDelete(id);
    }

    res.json({ success: false, message: "Payment was not completed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
