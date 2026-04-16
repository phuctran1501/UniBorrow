const express = require('express');
const router = express.Router();
const { 
    toggleFavorite, 
    getFavorites, 
    checkFavorite 
} = require('../controllers/yeuThichController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     YeuThich:
 *       type: object
 *       required:
 *         - MaDocGia
 *         - MaSach
 *       properties:
 *         MaDocGia:
 *           type: string
 *           description: ID của Độc giả
 *         MaSach:
 *           type: string
 *           description: ID của Sách
 */

/**
 * @swagger
 * tags:
 *   name: Yêu Thích
 *   description: Quản lý danh sách sách yêu thích của người dùng
 */

router.use(protect);

/**
 * @swagger
 * /api/yeuthich:
 *   get:
 *     summary: Lấy danh sách sách yêu thích của người dùng hiện tại
 *     tags: [Yêu Thích]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách object Sách
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sach'
 */
router.get('/', getFavorites);

/**
 * @swagger
 * /api/yeuthich/toggle/{sachId}:
 *   post:
 *     summary: Thêm hoặc xóa sách khỏi danh sách yêu thích
 *     tags: [Yêu Thích]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sachId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trạng thái cập nhật thành công
 */
router.post('/toggle/:sachId', toggleFavorite);

/**
 * @swagger
 * /api/yeuthich/check/{sachId}:
 *   get:
 *     summary: Kiểm tra xem sách đã có trong danh sách yêu thích chưa
 *     tags: [Yêu Thích]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sachId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về boolean isFavorite
 */
router.get('/check/:sachId', checkFavorite);

module.exports = router;
