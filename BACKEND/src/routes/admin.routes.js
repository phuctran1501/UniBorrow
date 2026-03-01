const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { confirmReturn } = require('../controllers/admin.controller');

router.put('/borrow/:id/confirm-return', protect, authorize('admin'), confirmReturn);

module.exports = router;