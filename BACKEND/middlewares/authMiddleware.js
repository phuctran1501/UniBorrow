const jwt = require('jsonwebtoken');
const DocGia = require('../models/DocGia');
const NhanVien = require('../models/NhanVien');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded.role === 'DocGia') {
                req.user = await DocGia.findById(decoded.id).select('-Password');
            } else if (decoded.role === 'NhanVien') {
                req.user = await NhanVien.findById(decoded.id).select(
                    '-Password'
                );
            }

            if (!req.user) {
                return res.status(401).json({ message: 'Người dùng không tồn tại trên hệ thống' });
            }

            req.userRole = decoded.role;
            next();
        } catch (error) {
            console.error('Lỗi xác thực JWT:', error);
            return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
        }
    } else {
        return res.status(401).json({ message: 'Vui lòng đăng nhập để truy cập tính năng này' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.userRole === 'NhanVien' && req.user.ChucVu === 'Admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Bạn không có quyền quản trị (Admin) để thực hiện' });
    }
};

const nhanVienOnly = (req, res, next) => {
    if (req.user && req.userRole === 'NhanVien') {
        next();
    } else {
        return res.status(403).json({ message: 'Quyền truy cập dành riêng cho nhân viên thư viện' });
    }
};

module.exports = { protect, admin, nhanVienOnly };
