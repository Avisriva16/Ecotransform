// models/Certificate.js
import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    material: { type: String, required: true },
    transactionHash: { type: String, required: true },
    image: { type: String },
});

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate; // ✅ make sure you have default export
