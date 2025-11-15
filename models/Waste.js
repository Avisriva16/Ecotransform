// models/Waste.js
import mongoose from "mongoose";

const wasteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  material: { type: String },
  quantity: { type: Number },
  price: { type: Number },
  images: [String], // array of image filenames/paths
  createdBy: { type: String },
}, { timestamps: true });

const Waste = mongoose.model("Waste", wasteSchema);

export default Waste;
