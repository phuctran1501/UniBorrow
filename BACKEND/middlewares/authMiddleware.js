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
                return res.status(401).json({ message: 'Người dùng không tồn tại' });
            }

            req.userRole = decoded.role;
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Không được phép truy cập, token không hợp lệ' });
        }
    } else {
        return res.status(401).json({ message: 'Không được phép truy cập, không có token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.userRole === 'NhanVien' && req.user.ChucVu === 'Admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Không được phép truy cập, chỉ dành cho Admin' });
    }
};

const nhanVienOnly = (req, res, next) => {
    if (req.user && req.userRole === 'NhanVien') {
        next();
    } else {
        return res.status(403).json({ message: 'Không được phép truy cập, chỉ dành cho Nhân viên' });
    }
};

module.exports = { protect, admin, nhanVienOnly };
