import mongoose from "mongoose";

const wasteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    material: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },

    // Store multiple image paths
    images: [{ type: String }],
    estimatedValue: { type: Number, default: 0 },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

const Waste = mongoose.model("Waste", wasteSchema);
export default Waste;
