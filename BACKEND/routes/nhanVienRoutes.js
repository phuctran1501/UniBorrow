const express = require('express');
const router = express.Router();
const { seedAdmin, createNhanVien, getNhanViens, deleteNhanVien, loginNhanVien } = require('../controllers/nhanVienController');
const { protect, admin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Nhân Viên
 *   description: Quản lý đăng nhập và tài khoản nhân sự (Dành cho Admin)
 */

/**
 * @swagger
 * /api/nhanvien/login:
 *   post:
 *     summary: Đăng nhập cho Nhân viên / Admin
 *     tags: [Nhân Viên]
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
 *         description: Đăng nhập thành công, trả về JWT Token
 *       401:
 *         description: Sai thông tin
 */
router.post('/login', loginNhanVien);

/**
 * @swagger
 * /api/nhanvien:
 *   get:
 *     summary: Lấy danh sách toàn bộ nhân viên (Chỉ Admin)
 *     tags: [Nhân Viên]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách nhân viên
 *   post:
 *     summary: Tạo nhân viên mới (Chỉ Admin)
 *     tags: [Nhân Viên]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *               HoTenNV:
 *                 type: string
 *               Password:
 *                 type: string
 *               ChucVu:
 *                 type: string
 *                 enum: [Admin, Nhân viên]
 *               DiaChi:
 *                 type: string
 *               SoDienThoai:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.route('/').get(protect, admin, getNhanViens).post(protect, admin, createNhanVien);

/**
 * @swagger
 * /api/nhanvien/{id}:
 *   delete:
 *     summary: Xóa nhân viên (Chỉ Admin)
 *     tags: [Nhân Viên]
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
 *         description: Xóa thành công
 */
router.route('/:id').delete(protect, admin, deleteNhanVien);

module.exports = router;
