const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const DocGia = require('../models/docgia.model');
const NhanVien = require('../models/nhanvien.model');
const ApiError = require('../utils/ApiError');

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      refId: user.refId
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// dang ky
const registerDocGia = async (data) => {
  const { maDocGia, hoLot, ten, ngaySinh, phai, diaChi, dienThoai, password } = data;

  if (!password) {
    throw new ApiError(400, 'Thiếu mật khẩu');
  }

  const existed = await User.findOne({ username: maDocGia });
  if (existed) {
    throw new ApiError(400, 'Mã độc giả đã tồn tại');
  }

  const docGia = await DocGia.create({
    maDocGia,
    hoLot,
    ten,
    ngaySinh,
    phai,
    diaChi,
    dienThoai
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: maDocGia,
    password: hashedPassword,
    role: 'doc_gia',
    refId: docGia._id
  });

  const token = generateToken(user);

  return { token };
};

// tao nhan vien
const createNhanVien = async (data) => {
  const { msnv, hoTenNV, password, chucVu } = data;

  if (!password) {
    throw new ApiError(400, 'Thiếu mật khẩu');
  }

  const existed = await User.findOne({ username: msnv });
  if (existed) {
    throw new ApiError(400, 'MSNV đã tồn tại');
  }

  const nhanVien = await NhanVien.create({
    msnv,
    hoTenNV,
    password,
    chucVu
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username: msnv,
    password: hashedPassword,
    role: 'nhan_vien',
    refId: nhanVien._id
  });

  return nhanVien;
};

// login
const login = async (username, password) => {
  if (!username || !password) {
    throw new ApiError(400, 'Thiếu username hoặc password');
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(401, 'Sai tài khoản hoặc mật khẩu');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Sai tài khoản hoặc mật khẩu');
  }

  const token = generateToken(user);

  return { token };
};

module.exports = { registerDocGia, createNhanVien, login };