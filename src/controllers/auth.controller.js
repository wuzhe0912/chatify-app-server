import {
  registerUser,
  loginUser,
  updateProfilePicture,
} from '../services/auth.service.js';
import { generateToken } from '../utils/auth.utils.js';
import { AppError } from '../utils/error.utils.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';

/*
  Controller to do 3 things:
  1. get data from request body
  2. call service to do the business logic
  3. send response to client
*/

export const register = async (req, res, next) => {
  try {
    // validate request body
    const { error } = registerSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const { email, fullName, password } = req.body;
    const newUser = await registerUser({ email, fullName, password });

    // generate token and setting cookie
    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      profilePicture: newUser.profilePicture,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const { email, password } = req.body;
    const user = await loginUser({ email, password });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { profilePicture } = req.body;
    if (!profilePicture) {
      throw new AppError('Profile picture is required', 400);
    }

    const updatedUser = await updateProfilePicture(userId, profilePicture);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const checkAuth = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
