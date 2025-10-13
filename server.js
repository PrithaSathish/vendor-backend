import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import crackerRoutes from "./routes/crackerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import seedAdmin from "./utils/seedAdmin.js";
import cors from "cors";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());


app.use(cors({
  origin: [
    "http://localhost:5173",                // for local testing
    "https://vendor-crackers.netlify.app"   // your deployed frontend
  ],
  credentials: true
}));


// Seed default admin
seedAdmin();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/crackers", crackerRoutes);
app.use("/api/orders", orderRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.send("✅ API is working fine!");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Server Error", error: err.message });
});

app.use("/api/dashboard", dashboardRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
