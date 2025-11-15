import express from "express";
import upload from "../middlewares/upload.js";
import { createWasteListing } from "../controllers/wasteController.js";

const router = express.Router();

router.post(
  "/create",
  upload.array("images", 5), // THIS WILL NOW WORK
  createWasteListing
);

export default router;
