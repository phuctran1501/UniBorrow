const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema(
  {
    maDocGia: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    hoLot: {
      type: String,
      required: true,
      trim: true
    },

    ten: {
      type: String,
      required: true,
      trim: true
    },

    ngaySinh: {
      type: Date,
      required: true
    },

    phai: {
      type: String,
      enum: ['Nam', 'Nu'],
      required: true
    },

    diaChi: {
      type: String,
      trim: true
    },

    dienThoai: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

docGiaSchema.index({ hoLot: 1, ten: 1 });

module.exports = mongoose.model('DocGia', docGiaSchema);
