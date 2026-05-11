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
    } = req.body;

    const images = Object.values(req.files || {}).flat();

    const productCategory = category || cateogory;
    const productSubCategory = subCategory || subcategory || subcatogory;
    const productSizes = sizes || size || "[]";
    const parsedSizes = JSON.parse(productSizes);

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
      });

      db.products.unshift(product);
      writeDb(db);

      return res.json({
        success: true,
        message: "Product Added",
        product,
      });
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
    };

    const product = new productModel(productData);

    await product.save();

    res.json({
      success: true,
      message: "Product Added",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const listProducts = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const products = readDb().products.map(normalizeProduct);

      return res.json({
        success: true,
        products,
        product: products,
      });
    }

    const products = await productModel.find({}).lean();

    const normalizedProducts = products.map(normalizeProduct);

    res.json({
      success: true,
      products: normalizedProducts,
      product: normalizedProducts,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const removeProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      db.products = db.products.filter(
        (product) => product._id !== req.body.id,
      );
      writeDb(db);

      return res.json({
        success: true,
        message: "Product Removed",
      });
    }

    await productModel.findByIdAndDelete(req.body.id);

    res.json({
      success: true,
      message: "Product Removed",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

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
    } = req.body;

    const updateData = {
      name,
      description,
      price,
      category,
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
    };

    // =========================
    // IMAGE UPDATE
    // =========================

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

    await productModel.findByIdAndUpdate(productId, updateData);

    res.json({
      success: true,
      message: "Product Updated",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

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
    res.json({
      success: false,
      message: error.message,
    });
  }
};
