import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../cloudinary.js'; // Import the configured Cloudinary instance

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Cloudinary instance configured elsewhere
  params: {
    folder: 'findit', // Cloudinary folder name
    format: async (req, file) => 'png', // Convert all images to PNG
    public_id: (req, file) => file.originalname.split('.')[0], // Set public_id as the original filename (without extension)
  },
});

// Create the multer upload instance with Cloudinary storage
const upload = multer({ storage });

export default upload;
