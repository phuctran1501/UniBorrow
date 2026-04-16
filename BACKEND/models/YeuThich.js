const mongoose = require('mongoose');

const yeuThichSchema = new mongoose.Schema(
    {
        MaDocGia: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'onModel'
        },
        onModel: {
            type: String,
            required: true,
            enum: ['DocGia', 'NhanVien'],
            default: 'DocGia'
        },
        MaSach: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sach',
            required: true
        }
    },
    { 
        timestamps: true 
    }
);

yeuThichSchema.index({ MaDocGia: 1, MaSach: 1, onModel: 1 }, { unique: true });

module.exports = mongoose.model('YeuThich', yeuThichSchema);
