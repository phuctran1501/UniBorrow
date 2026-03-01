const authService = require('../services/auth.service');

// docgia
const registerDocGia = async (req, res, next) => {
  try {
    const result = await authService.registerDocGia(req.body);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// admin tao nhanvien
const createNhanVien = async (req, res, next) => {
  try {
    const result = await authService.createNhanVien(req.body);

    res.status(201).json({
      success: true,
      message: 'Tạo nhân viên thành công',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerDocGia, createNhanVien, login };
