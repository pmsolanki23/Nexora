import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: { type: Array, default: [] },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },

    status: {
      type: String,
      default: "Order Placed",
      enum: [
        "Order Placed",
        "Packing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Stripe", "Razorpay"],
    },

    payment: {
      type: Boolean,
      default: false,
    },

    date: {
      type: Number,
      default: Date.now,
    },

    // =========================
    // RAZORPAY FIELDS
    // =========================

    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// =========================
// INDEXES
// =========================

orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ razorpayOrderId: 1 });

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
