const express = require('express');
const router = express.Router();
const { getNhaXuatBans, createNhaXuatBan, updateNhaXuatBan, deleteNhaXuatBan } = require('../controllers/nhaXuatBanController');
const { protect, nhanVienOnly } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     NhaXuatBan:
 *       type: object
 *       required: [TenNXB, DiaChi]
 *       properties:
 *         _id:
 *           type: string
 *         TenNXB:
 *           type: string
 *         DiaChi:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Nhà Xuất Bản
 *   description: Quản lý nhà xuất bản
 */

/**
 * @swagger
 * /api/nhaxuatban:
 *   get:
 *     summary: Lấy danh sách NXB
 *     tags: [Nhà Xuất Bản]
 *     responses:
 *       200:
 *         description: Trả về danh sách NXB
 *   post:
 *     summary: Thêm NXB mới (Chỉ Nhân viên)
 *     tags: [Nhà Xuất Bản]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [TenNXB, DiaChi]
 *             properties:
 *               TenNXB:
 *                 type: string
 *               DiaChi:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.route('/').get(getNhaXuatBans).post(protect, nhanVienOnly, createNhaXuatBan);

/**
 * @swagger
 * /api/nhaxuatban/{id}:
 *   put:
 *     summary: Sửa NXB (Chỉ Nhân viên)
 *     tags: [Nhà Xuất Bản]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TenNXB:
 *                 type: string
 *               DiaChi:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sửa thành công
 *   delete:
 *     summary: Xóa NXB (Chỉ Nhân viên)
 *     tags: [Nhà Xuất Bản]
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
router.route('/:id').put(protect, nhanVienOnly, updateNhaXuatBan).delete(protect, nhanVienOnly, deleteNhaXuatBan);

module.exports = router;
