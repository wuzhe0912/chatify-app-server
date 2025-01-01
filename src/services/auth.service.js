import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js';
import { AppError } from '../utils/error.utils.js';

export const registerUser = async ({ email, fullName, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already exists', 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    email,
    fullName,
    password: hashedPassword,
  });

  // save user to database
  const savedUser = await newUser.save();
  if (!savedUser) {
    throw new AppError('Failed to create user', 400);
  }

  return savedUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid email or password', 400);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError('Invalid password', 400);
  }

  return user;
};

export const updateProfilePicture = async (userId, base64Image) => {
  const uploadResponse = await cloudinary.uploader.upload(base64Image);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profilePicture: uploadResponse.secure_url },
    { new: true },
  );

  if (!updatedUser) {
    throw new AppError('Failed to update profile picture', 400);
  }

  return updatedUser;
};
