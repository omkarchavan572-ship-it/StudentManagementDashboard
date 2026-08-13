const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_student_management_2026'
      );

      const mongoose = require('mongoose');

      // Get user from token if valid ObjectId
      if (decoded.id && mongoose.Types.ObjectId.isValid(decoded.id)) {
        try {
          req.user = await User.findById(decoded.id).select('-password');
        } catch (e) {
          req.user = null;
        }
      }

      // Fallback for demo admin account
      if (!req.user) {
        req.user = {
          _id: decoded.id || 'admin_demo_id_2026',
          name: 'Dr. Sarah Jenkins (Admin)',
          email: 'admin@edu.com',
          role: 'admin'
        };
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

module.exports = { protect };
