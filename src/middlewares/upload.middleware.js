import multer from 'multer';
import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';

// Multer memory storage
const storage = multer.memoryStorage();

// Define fields for product upload
const productFields = [
  { name: 'thumbnail', maxCount: 1 },
  { name: 'barcode_url', maxCount: 1 },
  { name: 'qr_code_url', maxCount: 1 },
  { name: 'product_images', maxCount: 5 },
];

// Multer middleware for multiple fields
export const uploadProductFields = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).fields(productFields);

// Helper: upload single buffer to Cloudinary
const uploadBufferToCloudinary = (buffer, folder = 'sneaker-api') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

// Middleware: upload all product files to Cloudinary
export const uploadAllToCloudinary = async (req, res, next) => {
  try {
    console.log('=== UPLOAD MIDDLEWARE DEBUG ===');
    console.log('req.files:', req.files);
    console.log('req.file:', req.file);
    
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files found in request');
      return next();
    }

    req.cloudinaryUrls = {};

    for (const [fieldName, files] of Object.entries(req.files)) {
      req.cloudinaryUrls[fieldName] = [];

      for (const file of files) {
        const result = await uploadBufferToCloudinary(file.buffer);
        req.cloudinaryUrls[fieldName].push(result.secure_url);
      }
    }

    next();
  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
};

// Combined middleware array for routes
export const uploadProductImages = [uploadProductFields, uploadAllToCloudinary];
