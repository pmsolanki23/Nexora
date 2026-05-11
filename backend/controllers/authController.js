import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

import userModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { makeId, readDb, writeDb } from "../services/localStore.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Invalid Email",
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const exists = db.users.find((user) => user.email === email);

      if (exists) {
        return res.json({
          success: false,
          message: "User Already Exists",
        });
      }

      const user = {
        _id: makeId(),
        name,
        email,
        password: await bcrypt.hash(password, 10),
        cartData: {},
        role: "user",
      };

      db.users.push(user);
      writeDb(db);

      return res.json({
        success: true,
        token: generateToken(user._id),
      });
    }

    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({
        success: false,
        message: "User Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const newUser = await user.save();

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const user = db.users.find((item) => item.email === email);

      if (!user) {
        return res.json({
          success: false,
          message: "User Doesn't Exist",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.json({
          success: false,
          message: "Invalid Credentials",
        });
      }

      return res.json({
        success: true,
        token: generateToken(user._id, user.role),
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User Doesn't Exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = generateToken("admin", "admin");

      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
