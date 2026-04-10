const mongoose = require('mongoose');

const sachSchema = new mongoose.Schema(
    {
        TenSach: { type: String, required: true },
        DonGia: { type: Number, required: true, default: 0 },
        SoQuyen: { type: Number, required: true, default: 0 },
        NamXuatBan: { type: Number },
        MaNXB: { type: mongoose.Schema.Types.ObjectId, ref: 'NhaXuatBan', required: true },
        TacGia: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Sach', sachSchema);
