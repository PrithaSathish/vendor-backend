import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import crackerRoutes from "./routes/crackerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import seedAdmin from "./utils/seedAdmin.js";
import cors from "cors";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();

// ✅ Fix for __dirname and __filename in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local
      "https://vendor-crackers.netlify.app", // deployed frontend
    ],
    credentials: true,
  })
);

// ✅ Seed default admin (optional: wrap in try/catch)
seedAdmin();

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/crackers", crackerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.send("✅ API is working fine!");
});

// ✅ Serve frontend (React build)
app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// ✅ 404 handler (keep this after frontend handler)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Server Error", error: err.message });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
