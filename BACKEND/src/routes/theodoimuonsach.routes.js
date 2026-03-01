const express = require('express');
const router = express.Router();
const {
  muonSach,
  traSach,
} = require('../controllers/theodoimuonsach.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

// docgia
router.post('/', protect, authorize('doc_gia'), muonSach);

// nhanvien
router.post('/return/:id', protect, authorize('admin', 'nhan_vien'), traSach);

module.exports = router;
