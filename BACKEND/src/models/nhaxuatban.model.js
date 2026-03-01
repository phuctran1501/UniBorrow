const mongoose = require('mongoose');

const nhaXuatBanSchema = new mongoose.Schema(
  {
    maNXB: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    tenNXB: {
      type: String,
      required: true,
      trim: true
    },

    diaChi: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('NhaXuatBan', nhaXuatBanSchema);
