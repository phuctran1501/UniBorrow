const DocGia = require('../models/DocGia');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');


const registerDocGia = async (req, res) => {
    const { Username, HoLot, Ten, Password, NgaySinh, Phai, DiaChi, DienThoai } = req.body;
    try {
        const usernameExists = await DocGia.findOne({ Username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
        }

        // const phoneExists = await DocGia.findOne({ DienThoai });
        // if (phoneExists) {
        //     return res.status(400).json({ message: 'Số điện thoại đã được đăng ký' });
        // }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const docGia = await DocGia.create({
            Username,
            HoLot,
            Ten,
            Password: hashedPassword,
            NgaySinh,
            Phai,
            DiaChi,
            DienThoai,
        });

        if (docGia) {
            res.status(201).json({
                _id: docGia._id,
                Username: docGia.Username,
                HoLot: docGia.HoLot,
                Ten: docGia.Ten,
                DienThoai: docGia.DienThoai,
                token: generateToken(docGia._id, 'DocGia'),
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginDocGia = async (req, res) => {
    const { Username, Password } = req.body;
    try {
        const docGia = await DocGia.findOne({ Username });

        if (docGia && (await bcrypt.compare(Password, docGia.Password))) {
            if (!docGia.TrangThai) {
                return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa bởi Admin' });
            }
            res.json({
                _id: docGia._id,
                Username: docGia.Username,
                HoLot: docGia.HoLot,
                Ten: docGia.Ten,
                DienThoai: docGia.DienThoai,
                token: generateToken(docGia._id, 'DocGia'),
            });
        } else {
            res.status(401).json({ message: 'Tên tài khoản hoặc mật khẩu không đúng' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const docGia = await DocGia.findById(req.user._id).select('-Password');
        res.json(docGia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerDocGia,
    loginDocGia,
    getMe,
};
