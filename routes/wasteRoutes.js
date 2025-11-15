import express from "express";
import upload from "../middleware/upload.js";
import { createWasteListing } from "../controllers/wasteController.js";

const router = express.Router();

router.post(
"/create",
  upload.array("images", 5),
  (err, req, res, next) => { // Multer error handler must take 4 arguments
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ message: `Internal Server Error: ${err.message}` });
    }
    next(); // Continue to the controller if no error
  },
  createWasteListing
);

export default router;
