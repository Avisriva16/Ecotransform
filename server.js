import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

// Routes
import wasteRoutes from "./routes/wasteRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // optional
import certificateRoutes from "./routes/certificateRoutes.js"; // NFT certificates routes

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
app.use("/certificates", express.static(path.join(__dirname, "certificates"))); // for NFT certificate images

// -----------------------------
// Routes
// -----------------------------
app.use("/api/waste", wasteRoutes);

if (authRoutes) {
  app.use("/api/auth", authRoutes);
}

app.use("/api/certificates", certificateRoutes);

// -----------------------------
// MongoDB connection
// -----------------------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecotransform";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// -----------------------------
// Root endpoint
// -----------------------------
app.get("/", (req, res) => {
  res.send("🌿 Ecotransform Backend is running!");
});

// -----------------------------
// Start server
// -----------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
