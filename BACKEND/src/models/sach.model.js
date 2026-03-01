const mongoose = require('mongoose');

const sachSchema = new mongoose.Schema(
  {
    maSach: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    tenSach: {
      type: String,
      required: true,
      trim: true
    },

    donGia: {
      type: Number,
      required: true,
      min: 0
    },

    soQuyen: {
      type: Number,
      required: true,
      min: 0
    },

    namXuatBan: {
      type: Number,
      required: true
    },

    tacGia: {
      type: String,
      required: true,
      trim: true
    },

    nhaXuatBan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NhaXuatBan',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sach', sachSchema);
