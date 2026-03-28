import Image from '../models/Image.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Upload an image
// @route   POST /api/images/upload
// @access  Private
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const { title, category, collectionName, visibility } = req.body;

    const newImage = await Image.create({
      title: title || 'Untitled',
      imageUrl: req.file.path,
      public_id: req.file.filename,
      category: category || 'Uncategorized',
      collectionName: collectionName || 'Default',
      user: req.user.id,
      visibility: visibility || 'public',
    });

    res.status(201).json({ success: true, data: newImage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all images (with optional filters)
// @route   GET /api/images
// @access  Public
export const getImages = async (req, res) => {
  try {
    const { category, collectionName, search, page = 1, limit = 15, view } = req.query;
    
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (collectionName && collectionName !== 'All') query.collectionName = collectionName;
    if (search) query.title = { $regex: search, $options: 'i' };

    // Visibility and Ownership Logic
    if (view === 'my_uploads' || view === 'my_collections') {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
      }
      query.user = req.user.id;
    } else {
      // Default view: Public + Own Private
      if (req.user) {
        query.$or = [
          { visibility: 'public' },
          { visibility: { $exists: false } }, // Legacy without visibility field
          { user: req.user.id }
        ];
      } else {
        query.$or = [
          { visibility: 'public' },
          { visibility: { $exists: false } }
        ];
      }
    }

    const limitNum = parseInt(limit, 10);
    const skipNum = (parseInt(page, 10) - 1) * limitNum;

    const total = await Image.countDocuments(query);
    const images = await Image.find(query)
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum);
      
    const hasMore = (skipNum + images.length) < total;

    res.status(200).json({ success: true, count: images.length, total, hasMore, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an image
// @route   DELETE /api/images/:id
// @access  Private
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Check ownership
    // Allow delete if no user attached (legacy images) OR if current user matches
    if (image.user && image.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this image' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);
    
    // Delete from DB
    await image.deleteOne();
    
    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
