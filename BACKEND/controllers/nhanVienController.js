const NhanVien = require('../models/NhanVien');
const Sach = require('../models/Sach');
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

const createNhanVien = async (req, res) => {
    const { Email, HoTenNV, Password, ChucVu, DiaChi, SoDienThoai } = req.body;
    try {
        const userExists = await NhanVien.findOne({ Email });
        if (userExists) return res.status(400).json({ message: 'Tài khoản nhân viên này đã tồn tại' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const nhanVien = await NhanVien.create({
            Email,
            HoTenNV,
            Password: hashedPassword,
            ChucVu,
            DiaChi,
            SoDienThoai,
        });
        res.status(201).json(nhanVien);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const loginNhanVien = async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const nhanVien = await NhanVien.findOne({ Email });
        if (nhanVien && (await bcrypt.compare(Password, nhanVien.Password))) {
            res.json({
                _id: nhanVien._id,
                Email: nhanVien.Email,
                HoTenNV: nhanVien.HoTenNV,
                ChucVu: nhanVien.ChucVu,
                token: generateToken(nhanVien._id, 'NhanVien'),
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu nhân viên không chính xác' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const totalBooks = await Sach.countDocuments(); 
        const pendingCount = await TheoDoiMuonSach.countDocuments({ TrangThai: 'ChoDuyet' });
        const borrowingCount = await TheoDoiMuonSach.countDocuments({ TrangThai: 'DangMuon' });
        const overdueCount = await TheoDoiMuonSach.countDocuments({ TrangThai: 'QuaHan' });

        res.json({
            totalBooks,
            pendingCount,
            borrowingCount,
            overdueCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNhanVien,
    getNhanViens: async (req, res) => { 
     const n = await NhanVien.find().select('-Password'); res.json(n); },
    deleteNhanVien: async (req, res) => { await NhanVien.findByIdAndDelete(req.params.id); res.json({ message: 'Xóa thành công' }); },
    loginNhanVien,
    getDashboardStats
};
