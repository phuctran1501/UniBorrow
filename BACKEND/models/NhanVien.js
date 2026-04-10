const mongoose = require('mongoose');

const nhanVienSchema = new mongoose.Schema(
    {
        HoTenNV: { type: String, required: true },
        Password: { type: String, required: true },
        ChucVu: { type: String, enum: ['Admin', 'Nhân viên'], default: 'Nhân viên' },
        DiaChi: { type: String },
        SoDienThoai: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('NhanVien', nhanVienSchema);
