const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema(
    {
        Email: { type: String, required: true, unique: true },
        HoLot: { type: String, required: true },
        Ten: { type: String, required: true },
        Password: { type: String, required: false },
        NgaySinh: { type: Date },
        Phai: { type: String, enum: ['Nam', 'Nữ', 'Khác'] },
        DiaChi: { type: String },
        DienThoai: { type: String },
        TrangThai: { type: Boolean, default: true }, 
    },
    { 
        timestamps: true 
    }
);

module.exports = mongoose.model('DocGia', docGiaSchema);
