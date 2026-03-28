import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL'],
  },
  public_id: {
    type: String,
    required: [true, 'Please add a Cloudinary public ID'],
  },
  category: {
    type: String,
    default: 'Uncategorized',
    trim: true,
  },
  collectionName: {
    type: String,
    default: 'Default',
    trim: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false, // Make it optional to avoid breaking existing anonymous uploads
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
}, {
  timestamps: true,
});

const Image = mongoose.model('Image', imageSchema);

export default Image;
