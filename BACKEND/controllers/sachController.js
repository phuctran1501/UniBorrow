const Sach = require('../models/Sach');
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');
const DocGia = require('../models/DocGia');
const mongoose = require('mongoose');
const { sendEmail } = require('../utils/emailService');
const { checkOverdueBorrows } = require('../utils/cronJobs');

const getBooks = async (req, res) => {
    try {
        const query = {};
        const page = parseInt(req.query.page) || 1;
        const limit = 12; 
        const skip = (page - 1) * limit;

        if (req.query.keyword) {
            query.$or = [
                { TenSach: { $regex: req.query.keyword, $options: 'i' } },
                { TacGia: { $regex: req.query.keyword, $options: 'i' } }
            ];
        }
        
        if (req.query.available === 'true') {
            query.SoQuyen = { $gt: 0 };
        }

        if (req.query.publisherId) {
            const publishers = Array.isArray(req.query.publisherId) 
                ? req.query.publisherId 
                : req.query.publisherId.split(',');
            query.MaNXB = { $in: publishers };
        }

        if (req.query.theLoai) {
            const genres = Array.isArray(req.query.theLoai)
                ? req.query.theLoai
                : req.query.theLoai.split(',');
            query.TheLoai = { $in: genres };
        }
        
        const totalBooks = await Sach.countDocuments(query);
        const totalPages = Math.ceil(totalBooks / limit);

        const books = await Sach.find(query)
            .populate('MaNXB', 'TenNXB')
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(limit);

        res.json({
            books,
            totalBooks,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await Sach.findById(req.params.id).populate('MaNXB', 'TenNXB');
        if (!book) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }

        const luotMuon = await TheoDoiMuonSach.countDocuments({
            MaSach: req.params.id,
            TrangThai: { $in: ['DangMuon', 'DaTra', 'QuaHan', 'DaThanhToan'] }
        });

        const bookData = book.toObject();
        bookData.LuotMuon = luotMuon;

        res.json(bookData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerMuonSach = async (req, res) => {
    try {
        const sachId = req.params.id;
        const docGiaId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(sachId)) {
            return res.status(400).json({ message: 'ID sách không hợp lệ' });
        }

        const sach = await Sach.findById(sachId);
        if (!sach) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }
        
        if (sach.SoQuyen <= 0) {
            return res.status(400).json({ message: 'Sách này hiện đã hết trong kho' });
        }

        const dangPhat = await TheoDoiMuonSach.findOne({
            MaDocGia: docGiaId,
            TrangThai: 'QuaHan',
        });
        if (dangPhat) {
            return res.status(400).json({ message: 'Bạn đang có sách quá hạn chưa trả, không thể mượn thêm sách mới' });
        }

        const dangMuonCount = await TheoDoiMuonSach.countDocuments({
            MaDocGia: docGiaId,
            TrangThai: { $in: ['ChoDuyet', 'DangMuon'] }
        });
        
        if (dangMuonCount >= 5) {
            return res.status(400).json({ message: `Bạn chỉ được mượn tối đa 5 cuốn sách. Vui lòng trả sách hoặc đợi duyệt để tiếp tục.` });
        }

        const phieuMuon = await TheoDoiMuonSach.create({
            MaDocGia: docGiaId,
            MaSach: sachId,
            onModel: req.userRole || 'DocGia',
            TrangThai: 'ChoDuyet'
        });

        res.status(201).json({ message: 'Đăng ký mượn sách thành công, vui lòng chờ nhân viên duyệt', phieuMuon });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelMuonSach = async (req, res) => {
    try {
        const phieuMuon = await TheoDoiMuonSach.findById(req.params.idBorrow);

        if (!phieuMuon) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
        }

        if (phieuMuon.MaDocGia.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Bạn không có quyền thực hiện hành động này' });
        }

        if (phieuMuon.TrangThai !== 'ChoDuyet') {
            return res.status(400).json({ message: 'Chỉ có thể hủy phiếu khi đang trong trạng thái chờ duyệt' });
        }

        await phieuMuon.deleteOne();
        res.json({ message: 'Hủy đăng ký mượn sách thành công' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createBook = async (req, res) => {
    try {
        const book = await Sach.create(req.body);
        res.status(201).json({ message: 'Thêm sách thành công', book });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBook = async (req, res) => {
    try {
        const book = await Sach.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.json({ message: 'Cập nhật sách thành công', book });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Sach.findByIdAndDelete(req.params.id);
        if(!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.json({ message: 'Đã xóa sách thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveBorrow = async (req, res) => {
    try {
        const phieu = await TheoDoiMuonSach.findById(req.params.idBorrow);
        if(!phieu) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
        if(phieu.TrangThai !== 'ChoDuyet') return res.status(400).json({ message: 'Phiếu mượn không ở trạng thái chờ duyệt' });

        const sach = await Sach.findById(phieu.MaSach);
        if(sach.SoQuyen <= 0) return res.status(400).json({ message: 'Sách đã hết trong kho, không thể duyệt' });

        sach.SoQuyen -= 1;
        await sach.save();

        phieu.TrangThai = 'DangMuon';
        phieu.NgayMuon = Date.now();
        const hanTra = new Date();
        hanTra.setDate(hanTra.getDate() + 7);
        phieu.HanTra = hanTra;
        await phieu.save();

        const user = await DocGia.findById(phieu.MaDocGia);
        if (user && user.Email) {
            await sendEmail({
                to: user.Email,
                subject: '✅ YÊU CẦU MƯỢN SÁCH ĐÃ ĐƯỢC DUYỆT - UniBorrow',
                html: `
                    <div style="font-family: Arial, sans-serif;">
                        <h2>Yêu cầu mượn sách được duyệt</h2>
                        <p>Sách: <strong>${sach.TenSach}</strong></p>
                        <p>Hạn trả: <span style="color: #28a745;">${new Date(phieu.HanTra).toLocaleDateString('vi-VN')}</span></p>
                    </div>
                `
            });
        }

        res.json({ message: 'Đã duyệt mượn sách thành công', phieu });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const rejectBorrow = async (req, res) => {
    try {
        const phieu = await TheoDoiMuonSach.findById(req.params.idBorrow);
        if(!phieu) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
        if(phieu.TrangThai !== 'ChoDuyet') return res.status(400).json({ message: 'Chỉ có thể từ chối phiếu đang chờ duyệt' });

        phieu.TrangThai = 'TuChoi';
        await phieu.save();

        res.json({ message: 'Đã từ chối yêu cầu mượn sách', phieu });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const returnBook = async (req, res) => {
    try {
        const phieu = await TheoDoiMuonSach.findById(req.params.idBorrow);
        if(!phieu) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
        if(phieu.TrangThai !== 'DangMuon' && phieu.TrangThai !== 'QuaHan') return res.status(400).json({ message: 'Phiếu chưa được mượn hoặc đã trả rồi' });

        const sach = await Sach.findById(phieu.MaSach);
        if (sach) {
            sach.SoQuyen += 1;
            await sach.save();
        }

        phieu.TrangThai = 'DaTra';
        phieu.NgayTra = Date.now();
        await phieu.save();

        res.json({ message: 'Đã tiếp nhận trả sách thành công', phieu });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const payFine = async (req, res) => {
    try {
        const phieu = await TheoDoiMuonSach.findById(req.params.idBorrow);
        if(!phieu) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
        if(phieu.TrangThai !== 'QuaHan') return res.status(400).json({ message: 'Phiếu này không ở trạng thái quá hạn' });

        phieu.TrangThai = 'DaThanhToan';
        await phieu.save();
        res.json({ message: 'Đã xác nhận nộp phạt quá hạn', phieu });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyBorrows = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Không xác định được người dùng' });
        }
        
        const data = await TheoDoiMuonSach.find({ MaDocGia: req.user._id })
            .populate('MaSach', 'TenSach TacGia HinhAnh')
            .sort({ createdAt: -1 });
        
        const now = new Date();
        const overdueIds = data
            .filter(phieu => phieu.TrangThai === 'DangMuon' && phieu.HanTra && new Date(phieu.HanTra) < now)
            .map(phieu => phieu._id);

        if (overdueIds.length > 0) {
            await TheoDoiMuonSach.updateMany(
                { _id: { $in: overdueIds } },
                { $set: { TrangThai: 'QuaHan' } }
            );
            data.forEach(p => {
                if (overdueIds.includes(p._id)) p.TrangThai = 'QuaHan';
            });
        }

        res.json(data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const getAllBorrows = async (req, res) => {
    try {
        await checkOverdueBorrows();
        const data = await TheoDoiMuonSach.find().populate('MaSach', 'TenSach').populate('MaDocGia', 'Email HoLot Ten');
        res.json(data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const getRecentBooks = async (req, res) => {
    try {
        const data = await Sach.find().sort({ createdAt: -1 }).limit(6).populate('MaNXB', 'TenNXB');
        res.json(data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const getRecommendedBooks = async (req, res) => {
    try {
        const popularBooks = await TheoDoiMuonSach.aggregate([
            { $group: { _id: '$MaSach', borrowCount: { $sum: 1 } } },
            { $sort: { borrowCount: -1 } },
            { $limit: 6 }
        ]);

        if (popularBooks.length > 0) {
            const bookIds = popularBooks.map(item => item._id);
            const books = await Sach.find({ _id: { $in: bookIds } }).populate('MaNXB', 'TenNXB');
            
            const sortedBooks = bookIds.map(id => books.find(b => b._id.toString() === id.toString())).filter(Boolean);
            return res.json(sortedBooks);
        }

        const data = await Sach.find().sort({ createdAt: -1 }).limit(6).populate('MaNXB', 'TenNXB');
        res.json(data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

module.exports = {
    getBooks, getBookById, registerMuonSach, cancelMuonSach, 
    createBook, updateBook, deleteBook,
    approveBorrow, rejectBorrow, returnBook, payFine,
    getMyBorrows, getAllBorrows, getRecentBooks, getRecommendedBooks
};
