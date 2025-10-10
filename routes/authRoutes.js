import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Customer registration
router.post("/register", registerUser);

// Login (Admin & Customer)
router.post("/login", loginUser);

export default router;
