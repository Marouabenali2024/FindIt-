import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const itemsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    default:
      'https://res.cloudinary.com/your-cloud-name/image/upload/v1/default-image.png',
  },
  description: {
    type: String,
    default: 'No description',
  },
  category: {
    type: String,
    default: 'General',
  },
  location: {
    type: String,
    default: 'No location',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: [commentSchema],
  isFound: {
    type: Boolean,
    default: false,
  },
  isLost: {
    type: Boolean,
    default: false,
  },
});

const Item = mongoose.model('Item', itemsSchema);

export default Item;
