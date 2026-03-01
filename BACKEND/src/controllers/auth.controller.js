const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Generate JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};

/**
 * Register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name)  {
      return res.status(400).json({
        success: false,
        message: 'Tên là bắt buộc'
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu là bắt buộc'
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã tồn tại'
      });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu là bắt buộc'
      });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu không đúng'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
