import Waste from "../models/Waste.js"; // <--- ADDED: Must import the model
import { GoogleGenAI } from '@google/genai';
import fs from 'fs'; 
import path from 'path';

// Note: Ensure GEMINI_API_KEY is in your .env file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// This function is generally not needed if using JSON/Base64 test method
// function fileToGenerativePart(filePath, mimeType) {
//   // ... implementation ...
// }

export const createWasteListing = async (req, res) => {
  // Destructure required fields, including imageBase64 from the JSON body
  const { title, description, category, material, quantity, price, createdBy, imageBase64 } = req.body;
  
  let estimatedValue = 0;
  
  try {
      if (imageBase64) {
          // --- AI ESTIMATION START ---
          
          // 1. Prepare image data directly from the JSON body field
          const imagePart = {
              inlineData: {
                  // Split is used to remove the "data:image/jpeg;base64," prefix.
                  // If the client sends the data without the prefix, this will fail.
                  data: imageBase64.split(',')[1], 
                  mimeType: 'image/jpeg' 
              },
          };
          
          // 2. AI PROMPT
          const prompt = `Based on the image, category: ${category}, material: ${material}, and quantity: ${quantity} units, provide a very brief estimate of the current market value (in USD) for this type of waste material if sold in bulk. Only return the number, nothing else.`;
          
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: [imagePart, { text: prompt }], // Multimodal input
          });
          
          // 3. Clean and extract the number from the response
          const responseText = response.text.trim().replace(/[^\d.]/g, '');
          estimatedValue = parseFloat(responseText) || 0;
          
          // --- AI ESTIMATION END ---
      }

      // 4. Save the listing (image path is undefined in this test setup)
      const newWaste = new Waste({
          title, 
          description, 
          category, 
          material, 
          createdBy,
          // Conversion to Number is critical for Mongoose validation
          quantity: Number(quantity), 
          price: Number(price),      
          estimatedValue: estimatedValue, // Save the AI estimate
          image: undefined, // No image path saved in this test setup
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
      // Log the full error to the console for detailed debugging
      console.error("AI or Database Error:", err); 
      
      // If the error is an API failure (like key mismatch or rate limit), it stops here.
      if (err.message && err.message.includes('API')) {
          return res.status(500).json({ 
              message: "Gemini API Failure (Check Key/Quota)", 
              details: err.message
          });
      }
      
      // Otherwise, return a general 400 for validation/other issues
      res.status(400).json({ message: err.message || "Failed to process listing." });
  }
};
