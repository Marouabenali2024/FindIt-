import mongoose from 'mongoose';

const itemsSchema = new mongoose.Schema({
  name: { type: String, default: 'No Name' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, default: 'No description' },
  location: { type: String, default: 'No location' },
});

const Item = mongoose.model('Item', itemsSchema);

export default Item;
