import User from '../models/user.model.js';
import { verifyToken } from '../utils/auth.utils.js';

export const protectRoute = async (req, res, next) => {
  try {
    // 1. 從 Authorization Header 中取得 Bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - No Bearer Token' });
    }

    // 2. 拆出 token string
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - No Token Provided' });
    }

    // 3. 驗證 token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
    }

    // 4. 透過 decoded.userId 找到使用者
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    // 5. 將 user 存到 request 中，供後續 Controller 使用
    req.user = user;

    next();
  } catch (error) {
    console.log('Error in protectRoute middleware', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
