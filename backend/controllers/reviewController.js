import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

// =========================
// HELPER: Recalculate product rating
// =========================

const recalculateRating = async (productId) => {
  const result = await reviewModel.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const avg = result[0]?.averageRating ?? 0;
  const count = result[0]?.reviewCount ?? 0;

  await productModel.findByIdAndUpdate(productId, {
    averageRating: Math.round(avg * 10) / 10,
    reviewCount: count,
  });
};

// =========================
// ADD REVIEW
// =========================

export const addReview = async (req, res) => {
  try {
    const { productId, rating, title, body } = req.body;
    const userId = req.userId;

    if (!productId || !rating || !body) {
      return res.status(422).json({
        success: false,
        message: "productId, rating, and body are required",
      });
    }

    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5 || !Number.isInteger(ratingNum)) {
      return res.status(422).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    // Check verified buyer
    const hasPurchased = await orderModel.findOne({
      userId: userId.toString(),
      payment: true,
      "items._id": productId,
    });

    // Also check by product name match (items stored as full product objects)
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const hasPurchasedByName = await orderModel.findOne({
      userId: userId.toString(),
      payment: true,
      "items.name": product.name,
    });

    if (!hasPurchased && !hasPurchasedByName) {
      return res.status(403).json({
        success: false,
        message: "Purchase required to review this product",
      });
    }

    // Check duplicate review
    const existingReview = await reviewModel.findOne({
      productId: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Handle image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(422).json({
          success: false,
          message: "Maximum 5 images allowed per review",
        });
      }

      try {
        imageUrls = await Promise.all(
          req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
              resource_type: "image",
              folder: "nexora/reviews",
            });
            fs.unlinkSync(file.path);
            return result.secure_url;
          }),
        );
      } catch (uploadError) {
        // Clean up any uploaded files
        req.files.forEach((f) => {
          if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
        });
        return res.status(502).json({
          success: false,
          message: "Image upload failed. Please try again.",
        });
      }
    }

    const review = new reviewModel({
      productId: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(userId),
      rating: ratingNum,
      title: title || "",
      body,
      images: imageUrls,
      verifiedPurchase: true,
    });

    await review.save();
    await recalculateRating(productId);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// GET REVIEWS FOR A PRODUCT
// =========================

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sort = "newest", page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

    let sortObj = {};
    switch (sort) {
      case "highest":
        sortObj = { rating: -1, createdAt: -1 };
        break;
      case "lowest":
        sortObj = { rating: 1, createdAt: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const total = await reviewModel.countDocuments({
      productId: new mongoose.Types.ObjectId(productId),
    });

    const totalPages = Math.ceil(total / limitNum);
    const safePage = Math.min(pageNum, Math.max(1, totalPages));

    const reviews = await reviewModel
      .find({ productId: new mongoose.Types.ObjectId(productId) })
      .sort(sortObj)
      .skip((safePage - 1) * limitNum)
      .limit(limitNum)
      .populate("userId", "name profileImage")
      .lean();

    res.json({
      success: true,
      reviews,
      total,
      page: safePage,
      pageSize: limitNum,
      hasNextPage: safePage < totalPages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// DELETE REVIEW (Admin)
// =========================

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.body;

    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    const productId = review.productId;
    await reviewModel.findByIdAndDelete(reviewId);
    await recalculateRating(productId);

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// GET ALL REVIEWS (Admin)
// =========================

export const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));

    const total = await reviewModel.countDocuments();

    const reviews = await reviewModel
      .find()
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("userId", "name email profileImage")
      .populate("productId", "name image")
      .lean();

    res.json({
      success: true,
      reviews,
      total,
      page: pageNum,
      pageSize: limitNum,
      hasNextPage: pageNum * limitNum < total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
