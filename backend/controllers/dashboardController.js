import mongoose from "mongoose";

import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import { readDb } from "../services/localStore.js";

// =========================
// STATS
// =========================

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

    const [totalOrders, totalProducts, totalUsers, orders] = await Promise.all([
      orderModel.countDocuments(),
      productModel.countDocuments(),
      userModel.countDocuments(),
      orderModel.find({}).lean(),
    ]);

    const revenue = orders.reduce(
      (acc, item) => acc + Number(item.amount || 0),
      0,
    );

    const lowStockCount = await productModel.countDocuments({ lowStock: true });

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
        lowStockCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// DAILY SUMMARY
// =========================

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

      summary[day] ||= { day, orders: 0, revenue: 0 };
      summary[day].orders += 1;
      summary[day].revenue += Number(order.amount || 0);
    });

    res.json({
      success: true,
      dailySummary: Object.values(summary).slice(-7),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// TOP PRODUCTS
// =========================

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
        soldProducts[id] ||= { name: item.name || "Product", sold: 0 };
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// ANALYTICS (range-based)
// =========================

export const getAnalytics = async (req, res) => {
  try {
    const { range = "daily" } = req.query;

    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        data: [],
        topProducts: [],
        orderStatusBreakdown: [],
      });
    }

    const now = new Date();
    let startDate;
    let groupFormat;
    let labelFormat;

    switch (range) {
      case "weekly":
        startDate = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);
        groupFormat = { $week: { $toDate: { $multiply: ["$date", 1] } } };
        break;
      case "monthly":
        startDate = new Date(now.getTime() - 12 * 30 * 24 * 60 * 60 * 1000);
        groupFormat = {
          $dateToString: {
            format: "%Y-%m",
            date: { $toDate: { $multiply: ["$date", 1] } },
          },
        };
        break;
      default: // daily
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupFormat = {
          $dateToString: {
            format: "%Y-%m-%d",
            date: { $toDate: { $multiply: ["$date", 1] } },
          },
        };
    }

    const startTimestamp = startDate.getTime();

    // Revenue + orders over time
    const revenueData = await orderModel.aggregate([
      { $match: { date: { $gte: startTimestamp } } },
      {
        $group: {
          _id: groupFormat,
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Order status breakdown
    const statusBreakdown = await orderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Top 5 products
    const allOrders = await orderModel
      .find({ date: { $gte: startTimestamp } })
      .lean();

    const soldMap = {};
    allOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const key = item._id?.toString() || item.name;
        soldMap[key] ||= { name: item.name || "Product", sold: 0 };
        soldMap[key].sold += Number(item.quantity || 1);
      });
    });

    const topProducts = Object.values(soldMap)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    res.json({
      success: true,
      data: revenueData.map((d) => ({
        label: d._id,
        revenue: d.revenue,
        orders: d.orders,
      })),
      topProducts,
      orderStatusBreakdown: statusBreakdown.map((s) => ({
        status: s._id,
        count: s.count,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
