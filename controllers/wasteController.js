<<<<<<< HEAD
import Waste from "../models/waste.js";
import Certificate from "../models/certificate.js"; // corrected import
import crypto from "crypto"; // for mock NFT transaction hash

// ------------------------
// CREATE NEW WASTE LISTING WITH NFT CERTIFICATE
// ------------------------
=======
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

>>>>>>> 7888a3f103680921d18c188b6c2882d603e11133
export const createWasteListing = async (req, res) => {
  // Destructure required fields, including imageBase64 from the JSON body
  const { title, description, category, material, quantity, price, createdBy, imageBase64 } = req.body;
  
  let estimatedValue = 0;
  
  try {
<<<<<<< HEAD
    const {
      title,
      description,
      material,
      quantity,
      price,
      delivery,
      pickupDate,
      createdBy,
      category,
    } = req.body;
=======
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
>>>>>>> 7888a3f103680921d18c188b6c2882d603e11133

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

    // Generate a "mock NFT transaction hash"
    const transactionHash = "0x" + crypto.randomBytes(10).toString("hex");

    // Create the certificate linked to this waste
    const newCertificate = new Certificate({
      title: `${title} Certified`,
      amount: quantity,
      material,
      transactionHash,
      user: createdBy,
      wasteId: savedWaste._id,
    });

    const savedCertificate = await newCertificate.save();

    res.status(201).json({
      success: true,
      message: "Waste listed and NFT certificate created successfully",
      data: {
        waste: savedWaste,
        certificate: savedCertificate,
      },
    });
  } catch (err) {
    console.error("Error creating waste listing and certificate:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create waste listing and certificate",
    });
  }
};

// ------------------------
// GET ALL WASTE LISTINGS
// ------------------------
export const getAllWaste = async (req, res) => {
  try {
    const allWaste = await Waste.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: allWaste,
    });
  } catch (err) {
<<<<<<< HEAD
    console.error("Error fetching waste listings:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching waste listings",
    });
=======
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
>>>>>>> 7888a3f103680921d18c188b6c2882d603e11133
  }
};
