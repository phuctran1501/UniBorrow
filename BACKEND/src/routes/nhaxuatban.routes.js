const express = require('express');
const router = express.Router();

const { createNhaXuatBan, getAllNhaXuatBan } = require('../controllers/nhaxuatban.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', getAllNhaXuatBan);

router.post('/', protect, authorize('admin', 'nhan_vien'), createNhaXuatBan);

module.exports = router;
