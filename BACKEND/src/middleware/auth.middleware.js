/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

exports.protect = (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Không có token'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, 'Token không hợp lệ'));
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Không có quyền truy cập'));
    }
    next();
  };
};

module.exports = { protect: exports.protect, authorize: exports.authorize };
