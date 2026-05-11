import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  amount: Number,
  address: Object,
  status: {
    type: String,
    default: "Order Placed",
  },
  paymentMethod: String,
  payment: Boolean,
  date: Number,
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
