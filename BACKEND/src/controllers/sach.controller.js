const sachService = require('../services/sach.service');
const validateObjectId = require('../utils/validateObjectId');

// CREATE
const taoSach = async (req, res, next) => {
  try {
    const { maSach, tenSach, tacGia, donGia, soQuyen, namXuatBan, nhaXuatBan } = req.body;

    if (
      !maSach ||
      !tenSach ||
      !tacGia ||
      donGia === undefined ||
      soQuyen === undefined ||
      !nhaXuatBan
    ) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    if (donGia < 0 || soQuyen < 0) {
      return res.status(400).json({
        success: false,
        message: 'Đơn giá và số lượng phải là số không âm'
      });
    }

    if (!validateObjectId(nhaXuatBan)) {
      return res.status(400).json({
        success: false,
        message: 'ID nhà xuất bản không hợp lệ'
      });
    }

    const sach = await sachService.taoSach({
      maSach,
      tenSach,
      tacGia,
      donGia,
      soQuyen,
      namXuatBan,
      nhaXuatBan
    });

    res.status(201).json({
      success: true,
      message: 'Tạo sách thành công',
      data: sach
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL + SEARCH
const layDanhSachSach = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    const danhSach = await sachService.timSach(keyword);

    res.status(200).json({
      success: true,
      count: danhSach.length,
      data: danhSach
    });
  } catch (error) {
    next(error);
  }
};

// GET BY ID
const laySachTheoId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    const sach = await sachService.timSachTheoId(id);

    if (!sach) {
      return res.status(404).json({
        success: false,
        message: 'Sách không tồn tại'
      });
    }

    res.status(200).json({
      success: true,
      data: sach
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const capNhatSach = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    const sach = await sachService.capNhatSach(id, req.body);

    if (!sach) {
      return res.status(404).json({
        success: false,
        message: 'Sách không tồn tại'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật sách thành công',
      data: sach
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
const xoaSach = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    const sach = await sachService.xoaSach(id);

    if (!sach) {
      return res.status(404).json({
        success: false,
        message: 'Sách không tồn tại'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa sách thành công'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { taoSach, layDanhSachSach, laySachTheoId, capNhatSach, xoaSach };
