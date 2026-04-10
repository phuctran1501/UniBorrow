const mongoose = require('mongoose');

const nhaXuatBanSchema = new mongoose.Schema(
    {
        TenNXB: { type: String, required: true, unique: true },
        DiaChi: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('NhaXuatBan', nhaXuatBanSchema);
