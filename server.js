import express from "express";
import session from "express-session";

import cors from "cors";
import dotenv from "dotenv";
import MongoDBStore from "connect-mongodb-session";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const MongoDBStoreSession = MongoDBStore(session);

const app = express();
const store = new MongoDBStoreSession({
    uri: process.env.MONGO_URI,
    collection: "sessions",
  });

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Session middleware
app.use(
  session({
    name: "session_id",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    store: store,
  })
);

// Routes
app.use("/api/auth", authRoutes);

// Example protected route
app.get("/api/protected", (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ msg: "Unauthorized" });

  res.json({ msg: "Access granted!" });
});


app.listen(5000, () => console.log("Server running on port 5000"));

