import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as imageService from '../services/image.service.js';

// @desc    Upload an image
// @route   POST /api/images/upload
// @access  Private
export const uploadImage = asyncHandler(async (req, res) => {
    const newImage = await imageService.uploadAndSaveImage(req.user.id, req.file, req.body);
    return res.status(201).json(new ApiResponse(201, newImage, "Image uploaded successfully"));
});

// @desc    Get all images (with optional filters)
// @route   GET /api/images
// @access  Public
export const getImages = asyncHandler(async (req, res) => {
    const result = await imageService.getImages(req.query, req.user);
    return res.status(200).json(
        new ApiResponse(200, result, "Images fetched successfully")
    );
});

// @desc    Delete an image
// @route   DELETE /api/images/:id
// @access  Private
export const deleteImage = asyncHandler(async (req, res) => {
    await imageService.deleteImage(req.user.id, req.params.id);
    return res.status(200).json(new ApiResponse(200, {}, "Image deleted successfully"));
});
