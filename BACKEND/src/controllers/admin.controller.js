const Borrow = require('../models/borrow.model');
const Book = require('../models/book.model');

const confirmReturn = async (req, res, next) => {
  try {
    const { id } = req.params;

    const borrow = await Borrow.findById(id).populate('book');

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Phiếu mượn không tồn tại'
      });
    }

    if (borrow.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Sách đã được xác nhận hoàn trả'
      });
    }

    const now = new Date();

    // kiểm tra quá hạn
    if (now > borrow.dueDate) {
      borrow.isOverdue = true;

      if (!borrow.finePaid && borrow.isOverdue) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng thanh toán phí trước khi xác nhận hoàn trả.'
        });
      }
    }

    borrow.status = 'returned';
    borrow.returnedAt = now;

    await borrow.save();

    // tăng stock
    await Book.findByIdAndUpdate(borrow.book._id, {
      $inc: { stock: 1 }
    });

    res.json({
      success: true,
      message: 'Xác nhận hoàn trả sách thành công',
      data: borrow
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { confirmReturn };
