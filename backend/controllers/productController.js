import productModel from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import mongoose from "mongoose";
import {
  fallbackImage,
  makeId,
  normalizeProduct,
  readDb,
  writeDb,
} from "../services/localStore.js";

// =========================
// HELPER: Compute total stock
// =========================

const computeTotalStock = (product) => {
  let total = 0;

  if (product.variants && product.variants.length > 0) {
    product.variants.forEach((v) => {
      if (v.stock instanceof Map) {
        v.stock.forEach((qty) => { total += qty || 0; });
      } else if (v.stock && typeof v.stock === "object") {
        Object.values(v.stock).forEach((qty) => { total += qty || 0; });
      }
    });
  } else if (product.stock) {
    if (product.stock instanceof Map) {
      product.stock.forEach((qty) => { total += qty || 0; });
    } else if (typeof product.stock === "object") {
      Object.values(product.stock).forEach((qty) => { total += qty || 0; });
    }
  }

  return total;
};

// =========================
// ADD PRODUCT
// =========================

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      cateogory,
      subCategory,
      subcategory,
      subcatogory,
      sizes,
      size,
      bestseller,
      variants,
      stock,
    } = req.body;

    const images = Object.values(req.files || {}).flat();
    const productCategory = category || cateogory;
    const productSubCategory = subCategory || subcategory || subcatogory;
    const productSizes = sizes || size || "[]";
    const parsedSizes = JSON.parse(productSizes);

    // Parse variants if provided
    let parsedVariants = [];
    if (variants) {
      try {
        parsedVariants = JSON.parse(variants);
        // Validate unique colors
        const colors = parsedVariants.map((v) => v.color?.toLowerCase());
        if (new Set(colors).size !== colors.length) {
          return res.status(400).json({
            success: false,
            message: "Duplicate color values found in variants",
          });
        }
        if (parsedVariants.length > 20) {
          return res.status(400).json({
            success: false,
            message: "A product can have at most 20 variants",
          });
        }
      } catch (_) {
        parsedVariants = [];
      }
    }

    // Parse stock if provided
    let parsedStock = {};
    if (stock) {
      try {
        parsedStock = JSON.parse(stock);
      } catch (_) {
        parsedStock = {};
      }
    }

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const imageUrls = images.length
        ? images.map(
            (item) =>
              `${req.protocol}://${req.get("host")}/uploads/${item.filename}`,
          )
        : [fallbackImage];

      const product = normalizeProduct({
        _id: makeId(),
        name,
        description,
        category: productCategory,
        price: Number(price),
        subCategory: productSubCategory,
        bestseller: bestseller === "true",
        sizes: parsedSizes,
        image: imageUrls,
        date: Date.now(),
        variants: parsedVariants,
        stock: parsedStock,
        totalStock: 0,
        lowStock: false,
        averageRating: 0,
        reviewCount: 0,
      });

      db.products.unshift(product);
      writeDb(db);

      return res.json({ success: true, message: "Product Added", product });
    }

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        fs.unlinkSync(item.path);
        return result.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      category: productCategory,
      price: Number(price),
      subCategory: productSubCategory,
      subcategory: productSubCategory,
      cateogory: productCategory,
      subcatogory: productSubCategory,
      bestseller: bestseller === "true",
      sizes: parsedSizes,
      size: parsedSizes,
      image: imagesUrl,
      date: Date.now(),
      variants: parsedVariants,
      stock: parsedStock,
      totalStock: 0,
      lowStock: false,
      averageRating: 0,
      reviewCount: 0,
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// LIST PRODUCTS
// =========================

export const listProducts = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const products = readDb().products.map(normalizeProduct);
      return res.json({ success: true, products, product: products });
    }

    const products = await productModel.find({}).lean();
    const normalizedProducts = products.map(normalizeProduct);

    res.json({
      success: true,
      products: normalizedProducts,
      product: normalizedProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// REMOVE PRODUCT
// =========================

export const removeProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      db.products = db.products.filter((product) => product._id !== req.body.id);
      writeDb(db);
      return res.json({ success: true, message: "Product Removed" });
    }

    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// UPDATE PRODUCT
// =========================

export const updateProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      price,
      category,
      subCategory,
      bestseller,
      sizes,
      variants,
      stock,
    } = req.body;

    const updateData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes || "[]"),
    };

    // Parse variants
    if (variants !== undefined) {
      try {
        const parsedVariants = JSON.parse(variants);
        const colors = parsedVariants.map((v) => v.color?.toLowerCase());
        if (new Set(colors).size !== colors.length) {
          return res.status(400).json({
            success: false,
            message: "Duplicate color values found in variants",
          });
        }
        updateData.variants = parsedVariants;
      } catch (_) {}
    }

    // Parse stock
    if (stock !== undefined) {
      try {
        updateData.stock = JSON.parse(stock);
      } catch (_) {}
    }

    // Image update
    const images = req.files ? Object.values(req.files).flat() : [];
    if (images.length > 0) {
      let imagesUrl = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          fs.unlinkSync(item.path);
          return result.secure_url;
        }),
      );
      updateData.image = imagesUrl;
    }

    // Recompute total stock
    const existing = await productModel.findById(productId);
    if (existing) {
      const merged = { ...existing.toObject(), ...updateData };
      updateData.totalStock = computeTotalStock(merged);
      const threshold = existing.lowStockThreshold || 5;
      updateData.lowStock = updateData.totalStock <= threshold && updateData.totalStock > 0;
    }

    await productModel.findByIdAndUpdate(productId, updateData);
    res.json({ success: true, message: "Product Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// SINGLE PRODUCT
// =========================

export const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const product = readDb().products.find((item) => item._id === productId);
      return res.json({
        success: true,
        product: product ? normalizeProduct(product) : null,
      });
    }

    const product = await productModel.findById(productId).lean();
    res.json({
      success: true,
      product: product ? normalizeProduct(product) : null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// UPDATE STOCK (Admin)
// =========================

export const updateStock = async (req, res) => {
  try {
    const { productId, stock, variantColor, lowStockThreshold } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const threshold = lowStockThreshold ?? product.lowStockThreshold ?? 5;

    if (variantColor) {
      // Update specific variant stock
      const variantIndex = product.variants.findIndex(
        (v) => v.color.toLowerCase() === variantColor.toLowerCase(),
      );
      if (variantIndex === -1) {
        return res.status(404).json({ success: false, message: "Variant not found" });
      }
      product.variants[variantIndex].stock = new Map(Object.entries(stock));
    } else {
      // Update flat product stock
      product.stock = new Map(Object.entries(stock));
    }

    if (lowStockThreshold !== undefined) {
      product.lowStockThreshold = threshold;
    }

    const total = computeTotalStock(product);
    product.totalStock = total;
    product.lowStock = total > 0 && total <= threshold;

    await product.save();

    res.json({
      success: true,
      message: "Stock updated successfully",
      totalStock: total,
      lowStock: product.lowStock,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
