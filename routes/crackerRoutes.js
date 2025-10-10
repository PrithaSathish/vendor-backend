import express from "express";
import { addCracker, getCrackers, updateStock, deleteCracker } from "../controllers/crackerController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only → add new cracker
router.post("/", protect, adminOnly, addCracker);

// Public → get all crackers
router.get("/", getCrackers);

// Admin → delete cracker
router.delete("/:id", protect, adminOnly, deleteCracker);

// Admin → update stock only
router.patch("/:id/stock", protect, adminOnly, updateStock);

export default router;
