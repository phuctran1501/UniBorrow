const NhanVien = require('../models/NhanVien');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

const createNhanVien = async (req, res) => {
    const { Username, HoTenNV, Password, ChucVu, DiaChi, SoDienThoai } = req.body;
    try {
        const userExists = await NhanVien.findOne({ Username });
        if (userExists) return res.status(400).json({ message: 'Tài khoản đã tồn tại' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const nhanVien = await NhanVien.create({
            Username,
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

const getNhanViens = async (req, res) => {
    try {
        const nhanViens = await NhanVien.find().select('-Password');
        res.json(nhanViens);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNhanVien = async (req, res) => {
    try {
        const nhanVien = await NhanVien.findById(req.params.id);
        if (!nhanVien) return res.status(404).json({ message: 'Không tìm thấy' });
        
        await nhanVien.deleteOne();
        res.json({ message: 'Đã xóa nhân viên' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginNhanVien = async (req, res) => {
    const { Username, Password } = req.body;
    try {
        const nhanVien = await NhanVien.findOne({ Username });
        if (nhanVien && (await bcrypt.compare(Password, nhanVien.Password))) {
            res.json({
                _id: nhanVien._id,
                Username: nhanVien.Username,
                HoTenNV: nhanVien.HoTenNV,
                ChucVu: nhanVien.ChucVu,
                token: generateToken(nhanVien._id, 'NhanVien'),
            });
        } else {
            res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNhanVien,
    getNhanViens,
    deleteNhanVien,
    loginNhanVien
};
