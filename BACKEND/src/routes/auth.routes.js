const express = require('express');
const router = express.Router();

const { registerDocGia, createNhanVien, login } = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// docgia
router.post('/register', registerDocGia);

// login
router.post('/login', login);

// admin tao nhanvien
router.post('/create-employee', protect, authorize('admin'), createNhanVien);

module.exports = router;
