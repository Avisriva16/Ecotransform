// controllers/wasteController.js
// wasteController.js (CORRECTED - using capital 'W')

// GET all waste
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
export const createWaste = async (req, res) => {
  try {
    const newWaste = new Waste(req.body);
    const savedWaste = await newWaste.save();
    res.status(201).json(savedWaste);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
