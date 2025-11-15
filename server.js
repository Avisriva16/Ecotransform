import express from "express";
import session from "express-session";
<<<<<<< HEAD
=======
import wasteRoutes from "./routes/wasteRoutes.js";
>>>>>>> 9bf6f12e3291d8c9670a83cc2f5e8dc62311a458
import cors from "cors";
import dotenv from "dotenv";
import MongoDBStore from "connect-mongodb-session";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

// --- Correct usage of connect-mongodb-session ---
const MongoDBStoreSession = MongoDBStore(session); // this is correct
const store = new MongoDBStoreSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

// Catch store errors
store.on("error", (error) => {
  console.log("Session store error:", error);
});

// --- Middleware ---
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// --- Session middleware ---
app.use(
  session({
    name: "session_id",
    secret: process.env.SESSION_SECRET || "mySuperSecret123", // fallback secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    store: store,
  })
);

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/waste", wasteRoutes);
// Example protected route
app.get("/api/protected", (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ msg: "Unauthorized" });

  res.json({ msg: "Access granted!" });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
