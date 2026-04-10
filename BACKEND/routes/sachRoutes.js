const express = require('express');
const router = express.Router();
const { getBooks, registerMuonSach, cancelMuonSach } = require('../controllers/sachController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Sách
 *   description: Quản lý sách và mượn/hủy mượn
 */

/**
 * @swagger
 * /api/sach:
 *   get:
 *     summary: Tìm kiếm hoặc lấy danh sách tất cả các sách
 *     tags: [Sách]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Tên sách cần tìm kiếm
 *     responses:
 *       200:
 *         description: Danh sách các sách
 */
router.route('/').get(getBooks);

/**
 * @swagger
 * /api/sach/borrow/{id}:
 *   post:
 *     summary: Đăng ký mượn sách
 *     description: Tối đa 5 cuốn, chỉ mượn khi không có sách quá hạn và sách trong kho > 0
 *     tags: [Sách]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sách cần mượn (MaSach)
 *     responses:
 *       201:
 *         description: Đăng ký mượn sách thành công
 *       400:
 *         description: Đã đạt tối đa 5 cuốn / Hết sách / Quá hạn / Đã mượn quyển này
 *       403:
 *         description: Không phải là Độc Giả
 *       404:
 *         description: Không tìm thấy sách
 */
router.route('/borrow/:id').post(protect, registerMuonSach);

/**
 * @swagger
 * /api/sach/cancel/{idBorrow}:
 *   delete:
 *     summary: Hủy đăng ký mượn sách
 *     description: Chỉ có thể hủy khi trạng thái phiếu mượn là 'ChoDuyet'
 *     tags: [Sách]
 *     parameters:
 *       - in: path
 *         name: idBorrow
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phiếu mượn cần hủy
 *     responses:
 *       200:
 *         description: Hủy đăng ký thành công
 *       400:
 *         description: Không thể hủy sách đã duyệt hoặc đang mượn
 *       401:
 *         description: Không có quyền (không phải chủ phiếu mượn)
 *       404:
 *         description: Không tìm thấy phiếu mượn
 */
router.route('/cancel/:idBorrow').delete(protect, cancelMuonSach);

const { createBook, updateBook, deleteBook, approveBorrow, returnBook, payFine } = require('../controllers/sachController');
const { nhanVienOnly } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/sach:
 *   post:
 *     summary: Thêm sách mới (Nhân viên)
 *     tags: [Quản Lý Sách & Mượn TRả - Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Thành công
 */
router.route('/').post(protect, nhanVienOnly, createBook);

/**
 * @swagger
 * /api/sach/{id}:
 *   put:
 *     summary: Cập nhật sách (Nhân viên)
 *     tags: [Quản Lý Sách & Mượn TRả - Admin]
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
 *     responses:
 *       200:
 *         description: Thành công
 *   delete:
 *     summary: Xóa sách (Nhân viên)
 *     tags: [Quản Lý Sách & Mượn TRả - Admin]
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
router.route('/:id').put(protect, nhanVienOnly, updateBook).delete(protect, nhanVienOnly, deleteBook);

/**
 * @swagger
 * /api/sach/approve/{idBorrow}:
 *   put:
 *     summary: Duyệt mượn sách (Nhân viên)
 *     description: Sẽ tự động trừ số lượng sách đi 1 và gán ngày trả (sau 7 ngày)
 *     tags: [Quản Lý Sách & Mượn TRả - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idBorrow
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Duyệt thành công
 */
router.route('/approve/:idBorrow').put(protect, nhanVienOnly, approveBorrow);

/**
 * @swagger
 * /api/sach/return/{idBorrow}:
 *   put:
 *     summary: Xác nhận trả sách (Nhân viên)
 *     description: Tự động cộng số lượng sách lên 1
 *     tags: [Quản Lý Sách & Mượn TRả - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idBorrow
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả thành công
 */
router.route('/return/:idBorrow').put(protect, nhanVienOnly, returnBook);

/**
 * @swagger
 * /api/sach/pay-fine/{idBorrow}:
 *   put:
 *     summary: Nhận tiền phạt quá hạn (Nhân viên)
 *     tags: [Quản Lý Sách & Mượn TRả - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idBorrow
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thu tiền phạt thành công
 */
router.route('/pay-fine/:idBorrow').put(protect, nhanVienOnly, payFine);

module.exports = router;
