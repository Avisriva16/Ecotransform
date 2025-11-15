import Waste from "../models/Waste.js";
import { GoogleGenAI } from '@google/genai';
import fs from 'fs'; 
import path from 'path';
// CREATE new waste listing

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function fileToGenerativePart(filePath, mimeType) {
  // Read the file buffer
  const fileBuffer = fs.readFileSync(filePath);

  return {
    inlineData: {
      data: fileBuffer.toString("base64"),
      mimeType
    },
  };
}
export const createWasteListing = async (req, res) => {
  const { title, description, category, material, quantity, price, createdBy } = req.body;

  const imagePaths = req.files && req.files.length > 0 ? req.files.map(file => file.path) : [];
  const localImagePath = imagePaths[0]; // Get the path Multer saved

  let estimatedValue = 0;

  try {
    if (localImagePath) {
      // Prepare image and text parts for the Gemini model
      const imagePart = fileToGenerativePart(localImagePath, req.files[0].mimetype); 

      const prompt = `Based on the image, category: ${category}, material: ${material}, and quantity: ${quantity} units, provide a very brief estimate of the current market value (in USD) for this type of waste material if sold in bulk. Only return the number, nothing else.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [imagePart, { text: prompt }], // Multimodal input
      });

      // Clean the response to ensure it's just a number
      const responseText = response.text.trim().replace(/[^\d.]/g, '');
      estimatedValue = parseFloat(responseText) || 0;
    }

    // Save the listing data
    const newWaste = new Waste({
      title, description, category, material, createdBy,
      quantity: Number(quantity),
      price: Number(price), 
      image: localImagePath,
      estimatedValue: estimatedValue, // Save the AI result
    });

    const savedWaste = await newWaste.save();

    // Clean up: Delete the locally saved file after the AI has evaluated it
    if (localImagePath) {
         fs.unlinkSync(localImagePath); 
    }

    res.status(201).json(savedWaste);

  } catch (err) {
    console.error("AI or Database Error:", err);
    // Ensure you return an error response
    res.status(400).json({ message: err.message || "Failed to process listing." });
  }
};