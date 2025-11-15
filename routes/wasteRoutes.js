import express from "express";
import multer from "multer";
import upload from "../middleware/upload.js";
import { createWasteListing } from "../controllers/wasteController.js";

const router = express.Router();

// POST /waste/create
router.post(
  "/create",
  upload.array("images", 5),

  // Multer error handler (must have 4 params)
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ message: `Internal Error: ${err.message}` });
    }
    next();
  },

  createWasteListing
);

export default router;
