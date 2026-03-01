const NhaXuatBan = require('../models/nhaxuatban.model');
const ApiError = require('../utils/ApiError');

const createNhaXuatBan = async (data) => {
  const { maNXB, tenNXB, diaChi } = data;

  if (!maNXB || !tenNXB) {
    throw new ApiError(400, 'Vui lòng nhập đủ các trường bắt buộc');
  }

  const exists = await NhaXuatBan.findOne({ maNXB });
  if (exists) {
    throw new ApiError(400, 'Mã NXB đã tồn tại');
  }

  return await NhaXuatBan.create({
    maNXB,
    tenNXB,
    diaChi
  });
};

const getAllNhaXuatBan = async () => {
  return await NhaXuatBan.find();
};

module.exports = { createNhaXuatBan, getAllNhaXuatBan };
