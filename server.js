import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import wasteRoutes from "./routes/wasteRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // optional

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// -----------------------------
// Middleware
// -----------------------------
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,
}));
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------------------
// Routes
// -----------------------------
app.use("/api/waste", wasteRoutes);

if (authRoutes) {
  app.use("/api/auth", authRoutes);
}

// -----------------------------
// MongoDB connection
// -----------------------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecotransform";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// -----------------------------
// Start server
// -----------------------------

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
