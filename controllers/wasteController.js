// controllers/wasteController.js
// wasteController.js (CORRECTED - using capital 'W')

// GET all waste
import Waste from '../models/Waste.js';

export const getAllWaste = async (req, res) => {
  try {
    const wasteItems = await Waste.find();
    res.json(wasteItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single waste item
export const getWasteById = async (req, res) => {
  try {
    const wasteItem = await Waste.findById(req.params.id);
    if (!wasteItem) return res.status(404).json({ message: "Waste not found" });
    res.json(wasteItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create new waste item
export const createWasteListing = async (req, res) => {
  const { title, description, category, material, quantity, price, createdBy } = req.body; 
  
  // Also, check for req.files to confirm Multer ran:
  const imagePaths = req.files ? req.files.map(file => file.path) : [];
  try {
    const newWaste = new Waste({
      title,
      description,
      category,
      material,
      quantity,
      price,
      // If you only store one image path, use the first one; adjust as needed
      image: imagePaths[0], 
      createdBy: createdBy // Use the correct field name from the schema
    });

    const savedWaste = await newWaste.save();
    res.status(201).json(savedWaste);
  } catch (err) {
    // Return a more descriptive validation error if it's a Mongoose validation issue
    res.status(400).json({ message: err.message });
  }
};
