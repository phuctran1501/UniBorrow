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

const getDocGias = async (req, res) => {
    try {
        const docGias = await DocGia.find().select('-Password');
        res.json(docGias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const toggleStatusDocGia = async (req, res) => {
    try {
        const docGia = await DocGia.findById(req.params.id);
        if(!docGia) return res.status(404).json({message: 'Không tìm thấy độc giả'});

        docGia.TrangThai = !docGia.TrangThai;
        await docGia.save();
        res.json({ message: `Đã ${docGia.TrangThai ? 'Mở' : 'Khóa'} tài khoản`, TrangThai: docGia.TrangThai });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    registerDocGia,
    loginDocGia,
    getMe,
    getDocGias,
    toggleStatusDocGia
};
