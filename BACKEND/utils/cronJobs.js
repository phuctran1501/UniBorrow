const cron = require('node-cron');
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');
const Sach = require('../models/Sach');
const DocGia = require('../models/DocGia');
const NhanVien = require('../models/NhanVien');
const { sendEmail } = require('./emailService');

const initCronJobs = () => {
    // cron.schedule('0 0 * * *', async () => {
    //     console.log('--- Đang thực hiện kiểm tra sách quá hạn hàng ngày ---');
    //     await checkOverdueBorrows();
    // });
};

const checkOverdueBorrows = async (req, res) => {
    try {
        const today = new Date();
        
        const overdueBorrows = await TheoDoiMuonSach.find({
            TrangThai: { $in: ['DangMuon', 'QuaHan'] },
            HanTra: { $lt: today }
        }).populate('MaSach').populate('MaDocGia');

        let updatedCount = 0;
        let emailCount = 0;

        for (const phieu of overdueBorrows) {
            phieu.TrangThai = 'QuaHan';
            await phieu.save();
            updatedCount++;

            const user = phieu.MaDocGia;
            const sach = phieu.MaSach;

            if (user && user.Email) {
                const mailSent = await sendEmail({
                    to: user.Email,
                    subject: 'BẠN ĐANG CÓ SÁCH QUÁ HẠN - UniBorrow',
                    html: `
                        <div style="font-family: Arial, sans-serif;">
                                <h2>Bạn đang có sách quá hạn</h2>
                                <p>Sách: <strong>${sach.TenSach}</strong></p>
                                <p>Hạn trả: <span style="color: #f22816ff;">${new Date(phieu.HanTra).toLocaleDateString('vi-VN')}</span></p>
                                <p>Vui lòng thanh toán ở thư viện Uniborrow để có thể tiếp tục mượn sách.</p>
                            </div>
                    `
                });
                if (mailSent.success) emailCount++;
            }
        }

        const result = { 
            success: true,

            updatedCount,
            emailCount
        };

        if (res) return res.json(result);
        return result;

    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái quá hạn:', error);
        if (res) return res.status(500).json({ success: false, message: error.message });
        throw error;
    }
};

module.exports = { initCronJobs, checkOverdueBorrows };
