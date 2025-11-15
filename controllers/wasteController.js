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
// controllers/wasteController.js (Corrected for JSON/Base64 Testing)

export const createWasteListing = async (req, res) => {
  // Destructure required fields, including imageBase64 from the JSON body
  const { title, description, category, material, quantity, price, createdBy, imageBase64 } = req.body;
  
  let estimatedValue = 0;
  
  try {
      if (imageBase64) {
          // 1. Prepare image data directly from the JSON body field
          const imagePart = {
              inlineData: {
                  // Split is used to remove the "data:image/jpeg;base64," prefix
                  data: imageBase64.split(',')[1], 
                  mimeType: 'image/jpeg' 
              },
          };
          
          // 2. --- THE MISSING AI PROMPT ---
          const prompt = `Based on the image, category: ${category}, material: ${material}, and quantity: ${quantity} units, provide a very brief estimate of the current market value (in USD) for this type of waste material if sold in bulk. Only return the number, nothing else.`;
          
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: [imagePart, { text: prompt }], // Multimodal input
          });
          
          // 3. Clean and extract the number from the response
          const responseText = response.text.trim().replace(/[^\d.]/g, '');
          estimatedValue = parseFloat(responseText) || 0;
      }

      // 4. Save the listing (saving an undefined image path as we are bypassing Multer)
      const newWaste = new Waste({
          title, description, category, material, createdBy,
          quantity: Number(quantity), 
          price: Number(price),      
          estimatedValue: estimatedValue, 
          image: undefined, 
      });

      const savedWaste = await newWaste.save();
      res.status(201).json(savedWaste);

  } catch (err) {
      console.error("AI or Database Error:", err);
      res.status(400).json({ message: err.message || "Failed to process listing." });
  }
};