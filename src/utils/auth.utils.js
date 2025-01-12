import jwt from 'jsonwebtoken';

/*
  Generate a JWT token for a user
  @param {string} userId - The ID of the user to generate a token for
  @returns {string} - The generated JWT token
*/

export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });

  return token;
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
