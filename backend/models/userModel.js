import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: "",
  },

  phone: {
    type: String,
    default: "",
  },

  pincode: {
    type: String,
    default: "",
  },

  city: {
    type: String,
    default: "",
  },

  state: {
    type: String,
    default: "",
  },

  country: {
    type: String,
    default: "India",
  },

  address: {
    type: String,
    default: "",
  },

  landmark: {
    type: String,
    default: "",
  },

  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC INFO
    // =========================

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    // =========================
    // CART
    // =========================

    cartData: {
      type: Object,
      default: {},
    },

    // =========================
    // USER ROLE
    // =========================

    role: {
      type: String,
      default: "user",
    },

    // =========================
    // WISHLIST
    // =========================

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],

    // =========================
    // RECENTLY VIEWED
    // =========================

    recentlyViewed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],

    // =========================
    // SAVED ADDRESSES
    // =========================

    addresses: [addressSchema],

    // =========================
    // PROFILE SETTINGS
    // =========================

    isVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    minimize: false,
    timestamps: true,
  },
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
