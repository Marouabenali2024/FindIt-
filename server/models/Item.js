import mongoose from 'mongoose';
import validator from 'validator';

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    img: {
      type: String,
      validate: {
        validator: function (value) {
          return !value || validator.isURL(value);
        },
        message: (props) => `The value ${props.value} is not a valid URL!`,
      },
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    category: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    // 🗨️ Array of comments
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        userName: { type: String, required: true }, // Ensure this is in the schema
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    isFound: {
      type: Boolean,
      default: false,
    },
    isLost: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt to main item
);

const Item = mongoose.model('Item', itemSchema);

export default Item;
