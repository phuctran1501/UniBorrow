const express = require('express');
const router = express.Router();

const { createBook, getBooks } = require('../controllers/book.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('admin'), createBook);
router.get('/', getBooks);

module.exports = router;
