const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'speakwrite_super_secret_jwt_key_987654321_production');
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User no longer exists or session expired.' });
      }

      req.user = {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        englishLevel: user.englishLevel
      };

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired.' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no authorization token provided.' });
  }
};

module.exports = { protect };
