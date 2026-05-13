import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },

    title: {
      type: String,
      default: "",
      maxlength: [100, "Title cannot exceed 100 characters"],
      trim: true,
    },

    body: {
      type: String,
      required: true,
      maxlength: [1000, "Review body cannot exceed 1000 characters"],
      trim: true,
    },

    images: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length <= 5,
        message: "A review can have at most 5 images",
      },
    },

    verifiedPurchase: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// =========================
// COMPOUND UNIQUE INDEX
// One review per user per product
// =========================

reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ productId: 1, rating: -1 });

const reviewModel =
  mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;
