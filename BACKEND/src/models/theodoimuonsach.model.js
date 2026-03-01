const mongoose = require('mongoose');

const theoDoiMuonSachSchema = new mongoose.Schema(
  {
    docGia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocGia',
      required: false
    },

    sach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sach',
      required: true
    },

    nhanVien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NhanVien',
      required: false
    },

    ngayMuon: {
      type: Date,
      default: Date.now
    },

    hanTra: {
      type: Date,
      required: true
    },

    ngayTra: {
      type: Date,
      default: null
    },

    trangThai: {
      type: String,
      enum: ['dang_muon', 'da_tra'],
      default: 'dang_muon'
    },

    finePaid: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

theoDoiMuonSachSchema.virtual('isOverdue').get(function () {
  if (this.trangThai === 'da_tra') return false;
  return new Date() > this.hanTra;
});


theoDoiMuonSachSchema.index({ docGia: 1, sach: 1, trangThai: 1 }, { unique: false });

module.exports = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema);
