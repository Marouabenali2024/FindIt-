import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true, // Make sure password is required
  },
  /* img: {
    type: String,
    default: 'https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png',
  }, */
  email: {
    type: String,
    unique: true,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
