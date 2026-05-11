import mongoose from "mongoose";

import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import { readDb } from "../services/localStore.js";

export const getStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const revenue = db.orders.reduce(
        (acc, item) => acc + Number(item.amount || 0),
        0,
      );

      return res.json({
        success: true,
        stats: {
          totalOrders: db.orders.length,
          totalProducts: db.products.length,
          totalUsers: db.users.length,
          revenue,
          productsInStock: db.products.length,
          totalCustomers: db.users.length,
          totalRevenue: revenue,
        },
      });
    }

    const totalOrders = await orderModel.countDocuments();
    const totalProducts = await productModel.countDocuments();
    const totalUsers = await userModel.countDocuments();
    const orders = await orderModel.find({});
    const revenue = orders.reduce(
      (acc, item) => acc + Number(item.amount || 0),
      0,
    );

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalUsers,
        revenue,
        productsInStock: totalProducts,
        totalCustomers: totalUsers,
        totalRevenue: revenue,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getDailySummary = async (req, res) => {
  try {
    const orders =
      mongoose.connection.readyState === 1
        ? await orderModel.find({}).lean()
        : readDb().orders;
    const summary = {};

    orders.forEach((order) => {
      const day = new Date(order.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      summary[day] ||= {
        day,
        orders: 0,
        revenue: 0,
      };

      summary[day].orders += 1;
      summary[day].revenue += Number(order.amount || 0);
    });

    res.json({
      success: true,
      dailySummary: Object.values(summary).slice(-7),
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const orders =
      mongoose.connection.readyState === 1
        ? await orderModel.find({}).lean()
        : readDb().orders;
    const soldProducts = {};

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const id = item._id?.toString() || item.name;

        soldProducts[id] ||= {
          name: item.name || "Product",
          sold: 0,
        };

        soldProducts[id].sold += Number(item.quantity || 1);
      });
    });

    res.json({
      success: true,
      topProducts: Object.values(soldProducts)
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5),
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
