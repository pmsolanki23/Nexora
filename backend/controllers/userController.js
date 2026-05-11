import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import userModel from "../models/userModel.js";
import {
  makeId,
  normalizeProduct,
  readDb,
  writeDb,
} from "../services/localStore.js";

// =========================
// TOKEN GENERATOR
// =========================

const createToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

const safeUser = (user, db) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  role: user.role || "user",
  profileImage: user.profileImage || "",
  wishlist: (user.wishlist || []).map((id) => {
    const product = db?.products?.find((item) => item._id === id);
    return product ? normalizeProduct(product) : id;
  }),
  recentlyViewed: (user.recentlyViewed || []).map((id) => {
    const product = db?.products?.find((item) => item._id === id);
    return product ? normalizeProduct(product) : id;
  }),
  addresses: user.addresses || [],
});

// =========================
// REGISTER USER
// =========================

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    // EMAIL VALIDATION

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.json({
        success: false,
        message: "Invalid email format",
      });
    }

    // PASSWORD VALIDATION

    if (password.length < 6) {
      return res.json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // =========================
    // CHECK EXISTING USER
    // =========================

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const exists = db.users.find(
        (user) => user.email === email.toLowerCase(),
      );

      if (exists) {
        return res.json({
          success: false,
          message: "User already exists",
        });
      }

      const user = {
        _id: makeId(),
        name,
        email: email.toLowerCase(),
        password: await bcrypt.hash(password, 10),
        phone: "",
        profileImage: "",
        cartData: {},
        wishlist: [],
        recentlyViewed: [],
        addresses: [],
        role: "user",
        createdAt: Date.now(),
      };

      db.users.push(user);
      writeDb(db);

      return res.json({
        success: true,
        token: createToken(user._id, user.role),
        user: safeUser(user, db),
      });
    }

    const exists = await userModel.findOne({
      email: email.toLowerCase(),
    });

    if (exists) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // =========================
    // HASH PASSWORD
    // =========================

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // =========================
    // CREATE USER
    // =========================

    const newUser = new userModel({
      name,

      email: email.toLowerCase(),

      password: hashedPassword,

      phone: "",

      profileImage: "",

      cartData: {},

      wishlist: [],

      recentlyViewed: [],

      addresses: [],

      role: "user",
    });

    const user = await newUser.save();

    // =========================
    // TOKEN
    // =========================

    const token = createToken(user._id, user.role);

    // =========================
    // RESPONSE
    // =========================

    res.json({
      success: true,

      token,

      user: {
        _id: user._id,

        name: user.name,

        email: user.email,

        phone: user.phone,

        role: user.role,

        profileImage: user.profileImage,

        wishlist: user.wishlist,

        recentlyViewed: user.recentlyViewed,

        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// LOGIN USER
// =========================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }

    // =========================
    // FIND USER
    // =========================

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const user = db.users.find((item) => item.email === email.toLowerCase());

      if (!user) {
        return res.json({
          success: false,
          message: "User does not exist",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.json({
          success: false,
          message: "Invalid credentials",
        });
      }

      user.lastLogin = Date.now();
      writeDb(db);

      return res.json({
        success: true,
        token: createToken(user._id, user.role),
        user: safeUser(user, db),
      });
    }

    const user = await userModel.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }

    // =========================
    // PASSWORD CHECK
    // =========================

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // =========================
    // UPDATE LAST LOGIN
    // =========================

    user.lastLogin = new Date();

    await user.save();

    // =========================
    // TOKEN
    // =========================

    const token = createToken(user._id, user.role);

    // =========================
    // RESPONSE
    // =========================

    res.json({
      success: true,

      token,

      user: {
        _id: user._id,

        name: user.name,

        email: user.email,

        phone: user.phone,

        role: user.role,

        profileImage: user.profileImage,

        wishlist: user.wishlist,

        recentlyViewed: user.recentlyViewed,

        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// ADMIN LOGIN
// =========================

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        {
          email,
          role: "admin",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        },
      );

      return res.json({
        success: true,
        token,
      });
    }

    return res.json({
      success: false,
      message: "Invalid admin credentials",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GET USER PROFILE
// =========================

export const getUserProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const user = db.users.find((item) => item._id === req.userId);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      return res.json({
        success: true,
        user: safeUser(user, db),
      });
    }

    const user = await userModel
      .findById(req.userId)
      .populate("wishlist")
      .populate("recentlyViewed")
      .select("-password");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// UPDATE PROFILE
// =========================

export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const user = db.users.find((item) => item._id === req.userId);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      user.name = name;
      user.phone = phone;
      user.email = email.toLowerCase();
      writeDb(db);

      return res.json({
        success: true,
        message: "Profile updated successfully",
        user: safeUser(user, db),
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.userId,
      {
        name,

        phone,

        email: email.toLowerCase(),
      },
      {
        new: true,
      },
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// UPLOAD PROFILE IMAGE
// =========================

export const uploadProfileImage = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: false,
        message: "Profile image upload needs database connection",
      });
    }

    if (!req.file) {
      return res.json({
        success: false,
        message: "No image uploaded",
      });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.userId,
      {
        profileImage: imageUrl,
      },
      {
        new: true,
      },
    );

    res.json({
      success: true,
      message: "Profile image uploaded",
      image: updatedUser.profileImage,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// ADD ADDRESS
// =========================

export const addAddress = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const user = db.users.find((item) => item._id === req.userId);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      user.addresses ||= [];
      user.addresses.push({
        _id: makeId(),
        ...req.body,
      });
      writeDb(db);

      return res.json({
        success: true,
        message: "Address added successfully",
        addresses: user.addresses,
      });
    }

    const user = await userModel.findById(req.userId);

    user.addresses.push(req.body);

    await user.save();

    res.json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};
// =========================
// UPDATE ADDRESS
// =========================

export const updateAddress = async (req, res) => {
  try {
    const { addressId, updatedAddress } = req.body;

    // =========================
    // JSON DB
    // =========================

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();

      const user = db.users.find((item) => item._id === req.userId);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      user.addresses = (user.addresses || []).map((address) =>
        address._id === addressId
          ? {
              ...address,
              ...updatedAddress,
            }
          : address,
      );

      writeDb(db);

      return res.json({
        success: true,
        message: "Address updated successfully",
        addresses: user.addresses,
      });
    }

    // =========================
    // MONGODB
    // =========================

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.json({
        success: false,
        message: "Address not found",
      });
    }

    // =========================
    // UPDATE FIELDS
    // =========================

    Object.keys(updatedAddress).forEach((key) => {
      address[key] = updatedAddress[key];
    });

    await user.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};
// =========================
// DELETE ADDRESS
// =========================

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const user = db.users.find((item) => item._id === req.userId);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      user.addresses = (user.addresses || []).filter(
        (address) => address._id !== addressId,
      );
      writeDb(db);

      return res.json({
        success: true,
        message: "Address removed successfully",
        addresses: user.addresses,
      });
    }

    const user = await userModel.findById(req.userId);

    user.addresses = user.addresses.filter(
      (address) => address._id.toString() !== addressId,
    );

    await user.save();

    res.json({
      success: true,
      message: "Address removed successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// ADD TO WISHLIST
// =========================

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const user = db.users.find((item) => item._id === req.userId);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      user.wishlist ||= [];
      if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
      }
      writeDb(db);

      return res.json({
        success: true,
        wishlist: safeUser(user, db).wishlist,
      });
    }

    const user = await userModel.findById(req.userId);

    const alreadySaved = user.wishlist.some(
      (id) => id.toString() === productId,
    );

    if (!alreadySaved) {
      user.wishlist.push(productId);

      await user.save();
    }

    await user.populate("wishlist");

    res.json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// REMOVE FROM WISHLIST
// =========================

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const user = db.users.find((item) => item._id === req.userId);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      user.wishlist = (user.wishlist || []).filter((id) => id !== productId);
      writeDb(db);

      return res.json({
        success: true,
        wishlist: safeUser(user, db).wishlist,
      });
    }

    const user = await userModel.findById(req.userId);

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);

    await user.save();

    await user.populate("wishlist");

    res.json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GET WISHLIST
// =========================

export const getWishlist = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const user = db.users.find((item) => item._id === req.userId);

      return res.json({
        success: true,
        wishlist: user ? safeUser(user, db).wishlist : [],
      });
    }

    const user = await userModel.findById(req.userId).populate("wishlist");

    res.json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// RECENTLY VIEWED
// =========================

export const addRecentlyViewed = async (req, res) => {
  try {
    const { productId } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const db = readDb();
      const user = db.users.find((item) => item._id === req.userId);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      user.recentlyViewed = (user.recentlyViewed || []).filter(
        (id) => id !== productId,
      );
      user.recentlyViewed.unshift(productId);
      user.recentlyViewed = user.recentlyViewed.slice(0, 10);
      writeDb(db);

      return res.json({
        success: true,
        recentlyViewed: safeUser(user, db).recentlyViewed,
      });
    }

    const user = await userModel.findById(req.userId);

    user.recentlyViewed = user.recentlyViewed.filter(
      (id) => id.toString() !== productId,
    );

    user.recentlyViewed.unshift(productId);

    user.recentlyViewed = user.recentlyViewed.slice(0, 10);

    await user.save();

    res.json({
      success: true,
      recentlyViewed: user.recentlyViewed,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};
