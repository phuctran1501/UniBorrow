const express = require('express');
const router = express.Router();
const {
  taoSach,
  layDanhSachSach,
  laySachTheoId,
  capNhatSach,
  xoaSach
} = require('../controllers/sach.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

// docgia
router.get('/', layDanhSachSach);
router.get('/:id', laySachTheoId);

// nhanvien
router.post('/', protect, authorize('admin', 'nhan_vien'), taoSach);
router.put('/:id', protect, authorize('admin', 'nhan_vien'), capNhatSach);
router.delete('/:id', protect, authorize('admin', 'nhan_vien'), xoaSach);

module.exports = router;
