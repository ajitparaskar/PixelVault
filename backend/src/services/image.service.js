import Image from '../models/Image.js';
import { cloudinary } from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';

export const uploadAndSaveImage = async (userId, file, bodyData) => {
    if (!file) {
        throw new ApiError(400, "No image uploaded");
    }

    const { title, category, collectionName, visibility } = bodyData;

    const newImage = await Image.create({
        title: title || 'Untitled',
        imageUrl: file.path,
        public_id: file.filename,
        category: category || 'Uncategorized',
        collectionName: collectionName || 'Default',
        user: userId,
        visibility: visibility || 'public',
    });

    return newImage;
};

export const getImages = async (queryParams, user) => {
    const { category, collectionName, search, page = 1, limit = 15, view } = queryParams;

    let query = {};
    if (category && category !== 'All') query.category = category;
    if (collectionName && collectionName !== 'All') query.collectionName = collectionName;
    if (search) query.title = { $regex: search, $options: 'i' };

    // Visibility and Ownership Logic
    if (view === 'my_uploads' || view === 'my_collections') {
      if (!user) {
        throw new ApiError(401, 'Not authorized');
      }
      query.user = user.id;
    } else {
      // Default view: Public + Own Private
      if (user) {
        query.$or = [
          { visibility: 'public' },
          { visibility: { $exists: false } }, // Legacy without visibility field
          { user: user.id }
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

    return {
        count: images.length,
        total,
        hasMore,
        data: images
    };
};

export const deleteImage = async (userId, imageId) => {
    const image = await Image.findById(imageId);
    if (!image) {
        throw new ApiError(404, "Image not found");
    }

    // Check ownership
    if (image.user && image.user.toString() !== userId) {
        throw new ApiError(401, 'Not authorized to delete this image');
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // Delete from DB
    await image.deleteOne();
    
    return true;
};
