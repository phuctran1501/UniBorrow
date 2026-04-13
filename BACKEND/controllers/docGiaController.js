const DocGia = require('../models/DocGia');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');


const registerDocGia = async (req, res) => {
    const { Email, HoLot, Ten, Password, NgaySinh, Phai, DiaChi, DienThoai } = req.body;
    try {
        const userExists = await DocGia.findOne({ Email });
        if (userExists) {
            return res.status(400).json({ message: 'Tài khoản Email này đã tồn tại' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const docGia = await DocGia.create({
            Email,
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
                Email: docGia.Email,
                HoLot: docGia.HoLot,
                Ten: docGia.Ten,
                token: generateToken(docGia._id, 'DocGia'),
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu độc giả không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginDocGia = async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const docGia = await DocGia.findOne({ Email });

        if (docGia && (await bcrypt.compare(Password, docGia.Password))) {
            if (!docGia.TrangThai) {
                return res.status(403).json({ message: 'Tài khoản của bạn hiện đang bị khóa bởi Quản trị viên' });
            }
            res.json({
                _id: docGia._id,
                Email: docGia.Email,
                HoLot: docGia.HoLot,
                Ten: docGia.Ten,
                token: generateToken(docGia._id, 'DocGia'),
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
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

const socialLoginDocGia = async (req, res) => {
    let { Email, HoLot, Ten } = req.body;
    
    try {
        // gán các giá trị mặc định để tránh lỗi 'HoLot/Ten is required' từ Mongoose.
        if (!HoLot || HoLot.trim() === '') HoLot = 'Thành viên';
        if (!Ten || Ten.trim() === '') Ten = 'Social User';

        let docGia = await DocGia.findOne({ Email });
        
        if (!docGia) {
            docGia = await DocGia.create({ 
                Email, 
                HoLot: HoLot.trim(), 
                Ten: Ten.trim(), 
                Password: 'social_login_user'
            });
        }
        res.json({
            _id: docGia._id,
            Email: docGia.Email,
            HoLot: docGia.HoLot,
            Ten: docGia.Ten,
            token: generateToken(docGia._id, 'DocGia'),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerDocGia, loginDocGia, getMe,
    getDocGias: async (req, res) => { 
    const g = await DocGia.find().select('-Password'); res.json(g); },
    toggleStatusDocGia, socialLoginDocGia
};
