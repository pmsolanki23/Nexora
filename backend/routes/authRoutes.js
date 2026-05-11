import express from "express";

import authUser from "../middlewares/auth.js";

import upload from "../config/multer.js";

import {
  adminLogin,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  addAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  addRecentlyViewed,
  updateAddress,
} from "../controllers/userController.js";

const router = express.Router();

// =========================
// AUTH
// =========================

router.post("/admin", adminLogin);

router.post("/register", registerUser);

router.post("/login", loginUser);

// =========================
// PROFILE
// =========================

router.get("/profile", authUser, getUserProfile);

router.post("/update-profile", authUser, updateUserProfile);

router.post(
  "/upload-profile-image",
  authUser,
  upload.single("image"),
  uploadProfileImage,
);

// =========================
// ADDRESS
// =========================

router.post("/add-address", authUser, addAddress);

router.post("/delete-address", authUser, deleteAddress);

router.post("/update-address", authUser, updateAddress);

// =========================
// WISHLIST
// =========================

router.post("/add-wishlist", authUser, addToWishlist);

router.post("/remove-wishlist", authUser, removeFromWishlist);

router.get("/wishlist", authUser, getWishlist);

// =========================
// RECENTLY VIEWED
// =========================

router.post("/recently-viewed", authUser, addRecentlyViewed);

export default router;
