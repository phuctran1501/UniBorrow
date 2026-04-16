const express = require('express');
const router = express.Router();
const { registerDocGia, loginDocGia, getMe, socialLoginDocGia } = require('../controllers/docGiaController');
const { checkOverdueBorrows } = require('../utils/cronJobs');
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
 *               - Email
 *               - HoLot
 *               - Ten
 *               - Password
 *               - DiaChi
 *               - DienThoai
 *             properties:
 *               Email:
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
 *         description: Dữ liệu không hợp lệ hoặc Email/SĐT đã tồn tại
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
 *               - Email
 *               - Password
 *             properties:
 *               Email:
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
 * components:
 *   schemas:
 *     DocGia:
 *       type: object
 *       required: [Email, Ten, HoLot, Password]
 *       properties:
 *         Email:
 *           type: string
 *         Password:
 *           type: string
 *         HoLot:
 *           type: string
 *         Ten:
 *           type: string
 *         NgaySinh:
 *           type: string
 *           format: date
 *         Phai:
 *           type: string
 *           enum: [Nam, Nữ, Khác]
 *         DiaChi:
 *           type: string
 *         DienThoai:
 *           type: string
 *         HinhAnh:
 *           type: string
 *         TrangThai:
 *           type: string
 *           enum: [Active, Locked]
 */

/**
 * @swagger
 * /api/docgia/social-login:
 *   post:
 *     summary: Đăng nhập bằng Google/Mạng xã hội
 *     tags: [Độc Giả]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *                 description: JWT Token từ Google
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
router.post('/social-login', socialLoginDocGia);

/**
 * @swagger
 * /api/docgia/me:
 *   get:
 *     summary: Lấy thông tin cá nhân của Độc giả
 *     tags: [Độc Giả]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin độc giả hiện tại
 *       401:
 *         description: Không được phép hoặc thiếu token
 */
router.get('/me', protect, getMe);

const { getDocGias, toggleStatusDocGia } = require('../controllers/docGiaController');
const { admin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/docgia:
 *   get:
 *     summary: Danh sách tất cả Độc Giả (Khối Admin)
 *     tags: [Độc Giả]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách Độc giả 
 */
router.get('/', protect, admin, getDocGias);

/**
 * @swagger
 * /api/docgia/toggle-status/{id}:
 *   put:
 *     summary: Khóa / Mở khóa tài khoản Độc giả (Khối Admin)
 *     tags: [Độc Giả]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chuyển đổi trạng thái tài khoản thành công
 */
router.put('/toggle-status/:id', protect, admin, toggleStatusDocGia);

router.post('/test-overdue-check', protect, admin, async (req, res) => {
    try {
        await checkOverdueBorrows();
        res.json({ message: 'Đã hoàn thành quét quá hạn.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
