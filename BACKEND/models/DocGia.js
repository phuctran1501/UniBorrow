const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema(
    {
        Username: { type: String, required: true, unique: true },
        HoLot: { type: String, required: true },
        Ten: { type: String, required: true },
        Password: { type: String, required: true },
        NgaySinh: { type: Date },
        Phai: { type: String, enum: ['Nam', 'Nữ', 'Khác'] },
        DiaChi: { type: String, required: true },
        DienThoai: { type: String, required: true, unique: true },
        TrangThai: { type: Boolean, default: true }, 
    },
    { timestamps: true }
);

module.exports = mongoose.model('DocGia', docGiaSchema);
