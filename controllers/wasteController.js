import Waste from "../models/waste.js";

// ------------------------
// CREATE NEW WASTE LISTING
// ------------------------
export const createWasteListing = async (req, res) => {
  try {
    const { title, description, material, quantity, price, delivery, pickupDate, createdBy, category } = req.body;

    // Map uploaded files to static /uploads paths
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Create new waste document
    const newWaste = new Waste({
      title,
      description,
      material,
      quantity,
      price,
      delivery,
      pickupDate: pickupDate || null,
      createdBy,
      images,
      category,
    });

    const savedWaste = await newWaste.save();

    res.status(201).json({
      success: true,
      message: "Waste listed successfully",
      data: savedWaste,
    });
  } catch (err) {
    console.error("Error creating waste listing:", err);
    res.status(500).json({ success: false, message: "Error creating waste listing" });
  }
};

// ------------------------
// GET ALL WASTE LISTINGS
// ------------------------
export const getAllWaste = async (req, res) => {
  try {
    const allWaste = await Waste.find().sort({ createdAt: -1 });
    res.json(allWaste);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching waste listings" });
  }
};
