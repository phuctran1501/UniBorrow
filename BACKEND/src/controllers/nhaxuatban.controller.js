const nhaXuatBanService = require('../services/nhaxuatban.service');

const createNhaXuatBan = async (req, res, next) => {
  try {
    const result = await nhaXuatBanService.createNhaXuatBan(req.body);

    res.status(201).json({
      success: true,
      message: 'Tạo nhà xuất bản thành công',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getAllNhaXuatBan = async (req, res, next) => {
  try {
    const result = await nhaXuatBanService.getAllNhaXuatBan();

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNhaXuatBan, getAllNhaXuatBan };