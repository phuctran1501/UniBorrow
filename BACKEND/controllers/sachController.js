const Sach = require('../models/Sach');
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');

const getBooks = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                  TenSach: {
                      $regex: req.query.keyword,
                      $options: 'i',
                  },
              }
            : {};
        
        const books = await Sach.find({ ...keyword }).populate('MaNXB', 'TenNXB');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerMuonSach = async (req, res) => {
    try {
        
        // if (req.userRole !== 'DocGia') {
        //     return res.status(403).json({ message: 'Chỉ độc giả mới được đăng ký mượn sách' });
        // }

        const sachId = req.params.id;
        const docGiaId = req.user._id;

        const sach = await Sach.findById(sachId);
        if (!sach) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }
        if (sach.SoQuyen <= 0) {
            return res.status(400).json({ message: 'Sách này đã hết' });
        }

        const dangPhat = await TheoDoiMuonSach.findOne({
            MaDocGia: docGiaId,
            TrangThai: 'QuaHan',
        });
        if (dangPhat) {
            return res.status(400).json({ message: 'Bạn có sách quá hạn, vui lòng thanh toán tại thư viện để tiếp tục mượn sách' });
        }

        const dangMuonCount = await TheoDoiMuonSach.countDocuments({
            MaDocGia: docGiaId,
            TrangThai: { $in: ['ChoDuyet', 'DangMuon'] }
        });
        if (dangMuonCount >= 5) {
            return res.status(400).json({ message: 'Bạn chỉ được mượn tối đa 5 quyển sách' });
        }

        const phieuMuon = await TheoDoiMuonSach.create({
            MaDocGia: docGiaId,
            MaSach: sachId,
            TrangThai: 'ChoDuyet'
        });

        res.status(201).json({ message: 'Đăng ký mượn sách thành công, vui lòng chờ duyệt', phieuMuon });
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
            return res.status(401).json({ message: 'Không có quyền thực hiện' });
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

module.exports = {
    getBooks,
    registerMuonSach,
    cancelMuonSach
};

const createBook = async (req, res) => {
    try {
        const book = await Sach.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBook = async (req, res) => {
    try {
        const book = await Sach.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!book) return res.status(404).json({ message: 'Không tìm thấy' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Sach.findByIdAndDelete(req.params.id);
        if(!book) return res.status(404).json({ message: 'Không tìm thấy' });
        res.json({ message: 'Đã xóa sách' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveBorrow = async (req, res) => {
    try {
        const phieu = await TheoDoiMuonSach.findById(req.params.idBorrow);
        if(!phieu) return res.status(404).json({ message: 'Không tìm thấy' });
        if(phieu.TrangThai !== 'ChoDuyet') return res.status(400).json({ message: 'Trạng thái không đúng' });

        const sach = await Sach.findById(phieu.MaSach);
        if(sach.SoQuyen <= 0) return res.status(400).json({ message: 'Đã hết sách trong kho' });

        sach.SoQuyen -= 1;
        await sach.save();

        phieu.TrangThai = 'DangMuon';
        phieu.NgayMuon = Date.now();
        const hanTra = new Date();
        hanTra.setDate(hanTra.getDate() + 7);
        phieu.HanTra = hanTra;
        await phieu.save();

        res.json({ message: 'Đã duyệt mượn sách', phieu });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const returnBook = async (req, res) => {
    try {
        const phieu = await TheoDoiMuonSach.findById(req.params.idBorrow);
        if(!phieu) return res.status(404).json({ message: 'Không tìm thấy' });
        if(phieu.TrangThai !== 'DangMuon' && phieu.TrangThai !== 'QuaHan') return res.status(400).json({ message: 'Phiếu chưa mượn hoặc đã trả rồi' });

        const sach = await Sach.findById(phieu.MaSach);
        sach.SoQuyen += 1;
        await sach.save();

        phieu.TrangThai = 'DaTra';
        phieu.NgayTra = Date.now();
        await phieu.save();

        res.json({ message: 'Đã nhận trả sách', phieu });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const payFine = async (req, res) => {
    try {
        const phieu = await TheoDoiMuonSach.findById(req.params.idBorrow);
        if(!phieu) return res.status(404).json({ message: 'Không tìm thấy' });
        if(phieu.TrangThai !== 'QuaHan') return res.status(400).json({ message: 'Phiếu không trong trạng thái quá hạn' });

        phieu.TrangThai = 'DaThanhToan';
        await phieu.save();
        res.json({ message: 'Đã xác nhận nộp phạt', phieu });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBooks,
    registerMuonSach,
    cancelMuonSach,
    createBook,
    updateBook,
    deleteBook,
    approveBorrow,
    returnBook,
    payFine
};
