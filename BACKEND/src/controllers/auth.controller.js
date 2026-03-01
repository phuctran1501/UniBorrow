const User = require('../models/user.model');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // kiểm tra email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // tạo user
    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
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

module.exports = { register };
