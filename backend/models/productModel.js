import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: Array,
  category: String,
  cateogory: String,
  subCategory: String,
  subcategory: String,
  subcatogory: String,
  sizes: Array,
  size: Array,
  bestseller: Boolean,
  date: Number,
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
