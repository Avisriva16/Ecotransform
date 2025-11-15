import express from "express";
import multer from "multer";
import path from "path";
import Waste from "../models/waste.js";

const router = express.Router();

// Setup upload folder
const __dirname = path.resolve();
const uploadFolder = path.join(__dirname, "uploads");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); // save files in uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // unique filenames
  },
});

const upload = multer({ storage });

// Create Waste listing
router.post("/create", upload.array("images", 5), async (req, res) => {
  try {
    const { title, description, material, quantity, price, createdBy, category } = req.body;

    // Make sure files exist
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newWaste = new Waste({
      title,
      description,
      material,
      quantity,
      price,
      createdBy,
      images,
      category,
    });

    const savedWaste = await newWaste.save();
    res.json({ success: true, message: "Waste listed successfully", data: savedWaste });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating waste listing" });
  }
});

// Get all waste
router.get("/all", async (req, res) => {
  try {
    const allWaste = await Waste.find().sort({ createdAt: -1 });
    res.json(allWaste);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching waste listings" });
  }
});

export default router;
