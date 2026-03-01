const Book = require('../models/book.model');

const createBook = async (req, res, next) => {
  try {
    const { title, author, stock } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Tên sách là bắt buộc'
      });
    }

    if (!author) {
      return res.status(400).json({
        success: false,
        message: 'Tác giả là bắt buộc'
      });
    }

    if (stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng trong kho là bắt buộc'
      });
    }

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng trong kho phải là một số không âm'
      });
    }

    const book = await Book.create({
      title,
      author,
      stock
    });

    res.status(201).json({
      success: true,
      message: 'Sách đã được tạo thành công',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

const getBooks = async (req, res, next) => {
  try {
    const { name } = req.query;

    let query = {};

    if (name) {
      query.title = { $regex: name, $options: 'i' }; // không phân biệt hoa thường
    }

    const books = await Book.find(query);
    if (name && books.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBook, getBooks };
