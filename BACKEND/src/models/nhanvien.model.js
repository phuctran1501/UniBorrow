const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const nhanVienSchema = new mongoose.Schema(
  {
    msnv: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    hoTenNV: {
      type: String,
      required: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },

    chucVu: {
      type: String,
      enum: ['admin', 'nhan_vien'],
      default: 'nhan_vien'
    },

    diaChi: {
      type: String,
      trim: true
    },

    soDienThoai: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

nhanVienSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

nhanVienSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('NhanVien', nhanVienSchema);
