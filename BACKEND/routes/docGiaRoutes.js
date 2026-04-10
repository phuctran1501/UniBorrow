const express = require('express');
const router = express.Router();
const { registerDocGia, loginDocGia, getMe } = require('../controllers/docGiaController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Độc Giả
 *   description: Các API dành cho người mượn sách
 */

/**
 * @swagger
 * /api/docgia/register:
 *   post:
 *     summary: Đăng ký tài khoản độc giả mới
 *     tags: [Độc Giả]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Username
 *               - HoLot
 *               - Ten
 *               - Password
 *               - DiaChi
 *               - DienThoai
 *             properties:
 *               Username:
 *                 type: string
 *               HoLot:
 *                 type: string
 *               Ten:
 *                 type: string
 *               Password:
 *                 type: string
 *               NgaySinh:
 *                 type: string
 *                 format: date
 *                 example: "1999-01-01"
 *               Phai:
 *                 type: string
 *                 enum: [Nam, Nữ, Khác]
 *               DiaChi:
 *                 type: string
 *               DienThoai:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc Tên tài khoản/SĐT đã tồn tại
 */
router.post('/register', registerDocGia);

/**
 * @swagger
 * /api/docgia/login:
 *   post:
 *     summary: Đăng nhập tài khoản Độc giả
 *     tags: [Độc Giả]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Username
 *               - Password
 *             properties:
 *               Username:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Thông tin đăng nhập sai
 *       403:
 *         description: Tài khoản bị khóa
 */
router.post('/login', loginDocGia);

/**
 * @swagger
 * /api/docgia/me:
 *   get:
 *     summary: Lấy thông tin cá nhân của Độc giả
 *     tags: [Độc Giả]
 *     responses:
 *       200:
 *         description: Thông tin độc giả hiện tại
 *       401:
 *         description: Không được phép hoặc thiếu token
 */
router.get('/me', protect, getMe);

module.exports = router;
