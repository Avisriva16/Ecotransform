import express from "express";
import session from "express-session";
import wasteRoutes from "./routes/wasteRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
import MongoDBStore from "connect-mongodb-session";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";

dotenv.config();
connectDB();

const MongoDBStoreSession = MongoDBStore(session);

const app = express();

// -----------------------------
//  CORS (must come BEFORE sessions)
// -----------------------------
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// -----------------------------
//  Static Folder for Image Uploads
// -----------------------------
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------------------
//  Sessions
// -----------------------------
const store = new MongoDBStoreSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

app.use(
  session({
    name: "session_id",
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    store
  })
);

// -----------------------------
//  Routes
// -----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/waste", wasteRoutes);

// -----------------------------
// TEST Protected route
// -----------------------------
app.get("/api/protected", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  res.json({ msg: "Access granted!" });
});

// -----------------------------
// Start Server
// -----------------------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});