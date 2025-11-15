import multer from "multer";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();
const uploadFolder = path.join(__dirname, "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

export default upload;
