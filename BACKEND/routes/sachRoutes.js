const express = require('express');
const router = express.Router();
const { 
    getBooks, getBookById, registerMuonSach, cancelMuonSach, 
    getMyBorrows, getRecentBooks, createBook, updateBook, 
    deleteBook, approveBorrow, rejectBorrow, returnBook, 
    payFine, getAllBorrows 
} = require('../controllers/sachController');
const { protect, nhanVienOnly } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Sach:
 *       type: object
 *       required: [TenSach, DonGia, SoQuyen, NamXuatBan, MaNXB]
 *       properties:
 *         _id:
 *           type: string
 *         TenSach:
 *           type: string
 *         DonGia:
 *           type: number
 *         SoQuyen:
 *           type: number
 *         NamXuatBan:
 *           type: number
 *         MaNXB:
 *           type: string
 *           description: ID của Nhà Xuất Bản
 *         TenNXB:
 *           type: string
 *         HinhAnh:
 *           type: string
 *         TacGia:
 *           type: string
 *         MoTa:
 *           type: string
 *     TheoDoiMuonSach:
 *       type: object
 *       required: [MaDocGia, MaSach]
 *       properties:
 *         _id:
 *           type: string
 *         MaDocGia:
 *           type: string
 *         MaSach:
 *           type: object
 *           description: Thông tin sách có thể được populate
 *         NgayMuon:
 *           type: string
 *           format: date-time
 *         HanTra:
 *           type: string
 *           format: date-time
 *         NgayTra:
 *           type: string
 *           format: date-time
 *         TrangThai:
 *           type: string
 *           enum: [ChoDuyet, DangMuon, DaTra, QuaHan, DaThanhToan, TuChoi]
 *         TienPhat:
 *           type: number
 */

/**
 * @swagger
 * tags:
 *   name: Sách
 *   description: Quản lý kho sách và mượn trả
 */

/**
 * @swagger
 * /api/sach:
 *   get:
 *     summary: Lấy danh sách sách (Hỗ trợ phân trang và tìm kiếm)
 *     tags: [Sách]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trả về danh sách sách
 *   post:
 *     summary: Tạo sách mới (Chỉ Nhân viên)
 *     tags: [Sách]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sach'
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.route('/').get(getBooks).post(protect, nhanVienOnly, createBook);

/**
 * @swagger
 * /api/sach/recent:
 *   get:
 *     summary: Lấy 10 cuốn sách mới nhất
 *     tags: [Sách]
 *     responses:
 *       200:
 *         description: Danh sách sách mới
 */
router.get('/recent', getRecentBooks);

/**
 * @swagger
 * /api/sach/{id}:
 *   get:
 *     summary: Lấy chi tiết một cuốn sách
 *     tags: [Sách]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết sách
 *   put:
 *     summary: Cập nhật thông tin sách (Chỉ Nhân viên)
 *     tags: [Sách]
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
 *             $ref: '#/components/schemas/Sach'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa sách (Chỉ Nhân viên)
 *     tags: [Sách]
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
router.route('/:id').get(getBookById).put(protect, nhanVienOnly, updateBook).delete(protect, nhanVienOnly, deleteBook);

/**
 * @swagger
 * /api/sach/my-borrows:
 *   get:
 *     summary: Lấy lịch sử mượn sách của người dùng hiện tại
 *     tags: [Sách]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách lượt mượn
 */
router.get('/my-borrows', protect, getMyBorrows);

/**
 * @swagger
 * /api/sach/all-borrows:
 *   get:
 *     summary: Lấy toàn bộ danh sách mượn sách (Chỉ Nhân viên)
 *     tags: [Sách]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách mượn sách toàn hệ thống
 */
router.get('/all-borrows', protect, nhanVienOnly, getAllBorrows);

/**
 * @swagger
 * /api/sach/borrow/{id}:
 *   post:
 *     summary: Đăng ký mượn sách
 *     tags: [Sách]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công (Chờ duyệt)
 */
router.post('/borrow/:id', protect, registerMuonSach);

/**
 * @swagger
 * /api/sach/cancel/{idBorrow}:
 *   delete:
 *     summary: Hủy yêu cầu mượn sách đang chờ duyệt
 *     tags: [Sách]
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
 *         description: Hủy thành công
 */
router.delete('/cancel/:idBorrow', protect, cancelMuonSach);

/**
 * @swagger
 * /api/sach/approve/{idBorrow}:
 *   put:
 *     summary: Duyệt yêu cầu mượn sách (Chỉ Nhân viên)
 *     tags: [Sách]
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
router.put('/approve/:idBorrow', protect, nhanVienOnly, approveBorrow);

/**
 * @swagger
 * /api/sach/reject/{idBorrow}:
 *   put:
 *     summary: Từ chối yêu cầu mượn sách (Chỉ Nhân viên)
 *     tags: [Sách]
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
 *         description: Từ chối thành công
 */
router.put('/reject/:idBorrow', protect, nhanVienOnly, rejectBorrow);

/**
 * @swagger
 * /api/sach/return/{idBorrow}:
 *   put:
 *     summary: Xác nhận trả sách (Chỉ Nhân viên)
 *     tags: [Sách]
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
 *         description: Trả sách thành công
 */
router.put('/return/:idBorrow', protect, nhanVienOnly, returnBook);

/**
 * @swagger
 * /api/sach/pay-fine/{idBorrow}:
 *   put:
 *     summary: Xác nhận thanh toán tiền phạt (Chỉ Nhân viên)
 *     tags: [Sách]
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
 *         description: Thanh toán thành công
 */
router.put('/pay-fine/:idBorrow', protect, nhanVienOnly, payFine);

module.exports = router;
