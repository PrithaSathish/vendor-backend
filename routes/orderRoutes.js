import express from "express";
import {
  placeOrder,
  getOrders,
  getMyOrders,
  getTotalOrders,
  getTotalCustomers,
  getTotalSales,
  getTopCrackers,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer
router.post("/", placeOrder);
router.get("/my", getMyOrders);

// Admin
router.get("/", protect, adminOnly, getOrders);
router.get("/totalOrders", protect, adminOnly, getTotalOrders);
router.get("/totalCustomers", protect, adminOnly, getTotalCustomers);
router.get("/totalSales", protect, adminOnly, getTotalSales);
router.get("/topCrackers", protect, adminOnly, getTopCrackers);

export default router;
