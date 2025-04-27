import mongoose from 'mongoose';

// Comment Schema
const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  comments: [
    {
      userName: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
});

// Post Schema with an array of comments
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comments: [commentSchema], // Embedding the comment schema inside the post
});

const Post = mongoose.model('Post', postSchema);

export default Post;
