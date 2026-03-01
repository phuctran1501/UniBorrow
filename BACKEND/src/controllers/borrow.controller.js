const Borrow = require('../models/borrow.model');
const Book = require('../models/book.model');

const borrowBook = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const activeBorrows = await Borrow.countDocuments({
      user: req.user._id,
      status: 'borrowed'
    });

    if (activeBorrows >= 5) {
      return res.status(400).json({
        success: false,
        message: 'Bạn chỉ được mượn tối đa 5 quyển sách.'
      });
    }
    // kiểm tra còn nợ
    const unpaidFine = await Borrow.findOne({
      user: req.user._id,
      isOverdue: true,
      finePaid: false
    });

    if (unpaidFine) {
      return res.status(403).json({
        success: false,
        message: 'Bạn có sách quá hạn chưa trả. Vui lòng thanh toán tại thư viện.'
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Sách không tồn tại'
      });
    }

    if (book.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Sách đã hết hàng'
      });
    }

    // set hạn trả 7 ngày
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const borrow = await Borrow.create({
      user: req.user._id,
      book: bookId,
      dueDate
    });

    // giảm stock
    book.stock -= 1;
    await book.save();

    res.status(201).json({
      success: true,
      message: 'Mượn sách thành công',
      data: borrow
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { borrowBook };
