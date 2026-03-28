import express from 'express';
import { uploadImage, getImages, deleteImage } from '../controllers/images.controller.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/upload', upload.single('image'), uploadImage);
router.get('/', getImages);
router.delete('/:id', deleteImage);

export default router;
