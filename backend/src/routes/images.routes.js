import express from 'express';
import { uploadImage, getImages, deleteImage } from '../controllers/images.controller.js';
import { upload } from '../config/cloudinary.js';
import { protect, optionalProtect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/upload', protect, upload.single('image'), uploadImage);
router.get('/', optionalProtect, getImages);
router.delete('/:id', protect, deleteImage);

export default router;
