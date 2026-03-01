const Sach = require('../models/sach.model');
const NhaXuatBan = require('../models/nhaxuatban.model');
const ApiError = require('../utils/ApiError');

// CREATE
const taoSach = async (data) => {
  const nxb = await NhaXuatBan.findById(data.nhaXuatBan);
  if (!nxb) {
    throw new ApiError(400, 'Nhà xuất bản không tồn tại');
  }
  return await Sach.create(data);
};

// FIND ALL + SEARCH
const timSach = async (tenSach) => {
  let query = {};

  if (tenSach) {
    query.tenSach = { $regex: tenSach, $options: 'i' };
  }

  return await Sach.find(query);
};

// FIND BY ID
const timSachTheoId = async (id) => {
  return await Sach.findById(id);
};

// UPDATE
const capNhatSach = async (id, data) => {
  return await Sach.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
};

// DELETE
const xoaSach = async (id) => {
  return await Sach.findByIdAndDelete(id);
};

module.exports = { taoSach, timSach, timSachTheoId, capNhatSach, xoaSach };
