import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import { readDb, writeDb } from "../services/localStore.js";

export const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const user = db.users.find((item) => item._id === req.userId);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      const cartData = user.cartData || {};
      cartData[itemId] ||= {};
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
      user.cartData = cartData;
      writeDb(db);

      return res.json({
        success: true,
        message: "Added To Cart",
        cartData,
        cartdata: cartData,
      });
    }

    const userData = await userModel.findById(req.userId);
    let cartData = userData.cartData || {};

    cartData[itemId] ||= {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await userModel.findByIdAndUpdate(req.userId, {
      cartData,
    });

    res.json({
      success: true,
      message: "Added To Cart",
      cartData,
      cartdata: cartData,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const user = db.users.find((item) => item._id === req.userId);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      const cartData = user.cartData || {};
      cartData[itemId] ||= {};
      cartData[itemId][size] = Number(quantity);
      user.cartData = cartData;
      writeDb(db);

      return res.json({
        success: true,
        message: "Cart Updated",
        cartData,
        cartdata: cartData,
      });
    }

    const userData = await userModel.findById(req.userId);
    let cartData = userData.cartData || {};

    cartData[itemId] ||= {};
    cartData[itemId][size] = Number(quantity);

    await userModel.findByIdAndUpdate(req.userId, {
      cartData,
    });

    res.json({
      success: true,
      message: "Cart Updated",
      cartData,
      cartdata: cartData,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserCart = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const user = readDb().users.find((item) => item._id === req.userId);
      const cartData = user?.cartData || {};

      return res.json({
        success: true,
        cartData,
        cartdata: cartData,
      });
    }

    const userData = await userModel.findById(req.userId);
    const cartData = userData?.cartData || {};

    res.json({
      success: true,
      cartData,
      cartdata: cartData,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
