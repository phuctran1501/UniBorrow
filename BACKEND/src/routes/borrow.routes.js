const express = require('express');
const router = express.Router();

const { borrowBook } = require('../controllers/borrow.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, borrowBook);

module.exports = router;
