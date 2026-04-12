const mongoose = require('mongoose');

const sachSchema = new mongoose.Schema(
    {
        TenSach: { type: String, required: true },
        DonGia: { type: Number, default: 0 },
        SoQuyen: { type: Number, required: true, default: 0 },
        NamXuatBan: { type: Number },
        MaNXB: { type: mongoose.Schema.Types.ObjectId, ref: 'NhaXuatBan' },
        TacGia: { type: String },
        TheLoai: { 
            type: String, 
            enum: ['Công nghệ', 'Kinh tế', 'Giáo dục', 'Tiểu thuyết', 'Văn học', 'Thiếu nhi', 'Chưa xác định'],
            default: 'Chưa xác định' 
        },
        HinhAnh: { type: String },
        MoTa: { type: String },
    },
    { 
        timestamps: true 
    }
);

module.exports = mongoose.model('Sach', sachSchema);
