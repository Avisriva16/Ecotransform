import Waste from "../models/waste.js";
import Certificate from "../models/certificate.js"; // corrected import
import crypto from "crypto"; // for mock NFT transaction hash

// ------------------------
// CREATE NEW WASTE LISTING WITH NFT CERTIFICATE
// ------------------------
export const createWasteListing = async (req, res) => {
  try {
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
    console.error("Error fetching waste listings:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching waste listings",
    });
  }
};
