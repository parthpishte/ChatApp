import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token', error: error.message });
    }

    const { email } = decoded;

    const user = await User.findOne({ email }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Authentication failed', error: error.message });
  }
};