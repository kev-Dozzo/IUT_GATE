import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../config/db.js";
import {
  forgotPassword,
  login,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
