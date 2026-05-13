import express from "express";
import authUser from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js";
import upload from "../config/multer.js";

import {
  addReview,
  getProductReviews,
  deleteReview,
  getAllReviews,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// Public: get reviews for a product
reviewRouter.get("/product/:productId", getProductReviews);

// Authenticated: submit a review
reviewRouter.post("/add", authUser, upload.array("images", 5), addReview);

// Admin: get all reviews
reviewRouter.get("/all", authUser, adminAuth, getAllReviews);

// Admin: delete a review
reviewRouter.post("/delete", authUser, adminAuth, deleteReview);

export default reviewRouter;
