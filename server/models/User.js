import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  verifypwd: { type: Boolean, default: false },
  address: { type: String, required: true },
  phone: { type: String, required: true },
});

// Remove sensitive fields like password
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
