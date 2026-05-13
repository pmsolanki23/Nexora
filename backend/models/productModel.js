import mongoose from "mongoose";

// =========================
// VARIANT SCHEMA
// =========================

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true,
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => v.length <= 10,
      message: "A variant can have at most 10 images",
    },
  },
  priceOverride: {
    type: Number,
    default: null,
    min: [0.01, "Price override must be greater than 0"],
  },
  // stock: { "S": 10, "M": 5, "L": 0 }
  stock: {
    type: Map,
    of: Number,
    default: {},
  },
});

// =========================
// PRODUCT SCHEMA
// =========================

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    image: { type: [String], default: [] },

    // Category (keeping typo aliases for backward compat)
    category: { type: String, default: "" },
    cateogory: { type: String, default: "" },

    // SubCategory (keeping typo aliases for backward compat)
    subCategory: { type: String, default: "" },
    subcategory: { type: String, default: "" },
    subcatogory: { type: String, default: "" },

    // Sizes (keeping alias for backward compat)
    sizes: { type: [String], default: [] },
    size: { type: [String], default: [] },

    bestseller: { type: Boolean, default: false },
    date: { type: Number, default: Date.now },

    // =========================
    // NEW: STOCK MANAGEMENT
    // =========================

    // Flat stock for non-variant products: { "S": 10, "M": 5 }
    stock: {
      type: Map,
      of: Number,
      default: {},
    },

    // Total stock across all sizes/variants (computed, for quick out-of-stock check)
    totalStock: {
      type: Number,
      default: 0,
    },

    lowStock: {
      type: Boolean,
      default: false,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
    },

    // =========================
    // NEW: VARIANTS
    // =========================

    variants: {
      type: [variantSchema],
      default: [],
      validate: {
        validator: (v) => v.length <= 20,
        message: "A product can have at most 20 variants",
      },
    },

    // =========================
    // NEW: RATINGS
    // =========================

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// =========================
// INDEXES
// =========================

productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ date: -1 });
productSchema.index({ bestseller: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ totalStock: 1 });
productSchema.index({ name: "text", description: "text", category: "text" });

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
