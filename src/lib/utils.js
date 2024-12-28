import jwt from 'jsonwebtoken';

export const generateToken = (userId, response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  response.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // prevent client-side JavaScript from accessing the cookie
    sameSite: 'strict', // prevent CSRF attacks
    secure: process.env.NODE_ENV !== 'development', // only send cookie over HTTPS in production
  });

  return token;
};
