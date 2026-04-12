const mongoose = require('mongoose');

const theoDoiMuonSachSchema = new mongoose.Schema(
    {
        MaDocGia: { type: mongoose.Schema.Types.ObjectId, ref: 'DocGia', required: true },
        MaSach: { type: mongoose.Schema.Types.ObjectId, ref: 'Sach', required: true },
        NgayMuon: { type: Date, default: null }, 
        NgayTra: { type: Date, default: null }, 
        HanTra: { type: Date, default: null }, 
        TrangThai: {
            type: String,
            enum: ['ChoDuyet', 'DangMuon', 'DaTra', 'QuaHan', 'DaThanhToan', 'TuChoi'],
            default: 'ChoDuyet',
        },
    },
    { 
        timestamps: true 
    }
);

module.exports = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema);
