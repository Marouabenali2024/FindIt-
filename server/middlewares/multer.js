// Multer (image upload)
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';

const uploadDir = path.resolve(process.cwd(), 'uploads');

const createUploadsDir = async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
    console.log('📁 "uploads" directory is ready');
  } catch (err) {
    console.error('❌ Error creating "uploads" directory:', err);
  }
};

createUploadsDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const imageUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(
        new Error('❌ Invalid file type. Only JPEG, JPG, and PNG are allowed.'),
        false
      );
    }
  },
});

export default imageUpload;
