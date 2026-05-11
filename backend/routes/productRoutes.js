import express from "express";

import authUser from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js";

import upload from "../middlewares/uploadMiddleware.js";

import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", authUser, adminAuth, upload, addProduct);

productRouter.post("/remove", authUser, adminAuth, removeProduct);

productRouter.post("/single", singleProduct);

productRouter.get("/list", listProducts);

productRouter.post("/update", authUser, adminAuth, upload, updateProduct);

export default productRouter;
