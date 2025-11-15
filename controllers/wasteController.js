import Waste from "../models/Waste.js";

// CREATE new waste listing
export const createWasteListing = async (req, res) => {
  console.log("FILES RECEIVED:", req.files); // Debug
  console.log('--- DEBUG START ---');
  console.log('REQUEST BODY:', req.body); // Check if this is {} or undefined
  console.log('REQUEST FILES:', req.files); // Check if this contains your file data
  console.log('--- DEBUG END ---');

    // ONLY execute the destructuring IF req.body exists
    if (!req.body) {
        return res.status(500).json({ message: "Request body is empty, Multer failed." });
    }
  const { title, description, category, material, quantity, price, createdBy } = req.body;

  // Save uploaded image paths
  const imagePaths = req.files ? req.files.map((file) => file.path) : [];

  try {
    const newWaste = new Waste({
      title,
      description,
      category,
      material,
      quantity: Number(quantity),
      price: Number(price),
      createdBy:createdBy,
      images: imagePaths[0],
    });

    const savedWaste = await newWaste.save();
    res.status(201).json(savedWaste);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
