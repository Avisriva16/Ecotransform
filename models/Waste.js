// models/Waste.js
import mongoose from "mongoose";

const wasteSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    material: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    createdBy: { type: String } // artisan/user
  },
  { timestamps: true }
);

const Waste = mongoose.model("Waste", wasteSchema);
export default Waste;
