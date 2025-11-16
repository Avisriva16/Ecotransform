import express from "express";
import Certificate from "../models/Certificate.js";

const router = express.Router();

// GET all certificates
router.get("/", async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, certificates });
  } catch (err) {
    console.error("Error fetching certificates:", err);
    res.status(500).json({ success: false, message: "Failed to fetch certificates" });
  }
});

export default router;
