import express from "express";
import {
  adminLogin,
  registerUser,
  loginUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/admin", adminLogin);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
