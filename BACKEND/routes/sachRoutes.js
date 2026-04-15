const express = require('express');
const router = express.Router();
const { 
    getBooks, getBookById, registerMuonSach, cancelMuonSach, 
    getMyBorrows, getRecentBooks, createBook, updateBook, 
    deleteBook, approveBorrow, rejectBorrow, returnBook, 
    payFine, getAllBorrows 
} = require('../controllers/sachController');
const { protect, nhanVienOnly } = require('../middlewares/authMiddleware');

router.get('/recent', getRecentBooks);
router.get('/my-borrows', protect, getMyBorrows);
router.get('/all-borrows', protect, nhanVienOnly, getAllBorrows);

router.get('/', getBooks);
router.post('/', protect, nhanVienOnly, createBook);

router.get('/:id', getBookById);
router.put('/:id', protect, nhanVienOnly, updateBook);
router.delete('/:id', protect, nhanVienOnly, deleteBook);

router.post('/borrow/:id', protect, registerMuonSach);
router.delete('/cancel/:idBorrow', protect, cancelMuonSach);

router.put('/approve/:idBorrow', protect, nhanVienOnly, approveBorrow);
router.put('/reject/:idBorrow', protect, nhanVienOnly, rejectBorrow);
router.put('/return/:idBorrow', protect, nhanVienOnly, returnBook);
router.put('/pay-fine/:idBorrow', protect, nhanVienOnly, payFine);

module.exports = router;
