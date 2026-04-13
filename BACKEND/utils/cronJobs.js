const cron = require('node-cron');
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');
const { sendEmail } = require('./emailService');

const initCronJobs = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('--- Đang thực hiện kiểm tra sách quá hạn hàng ngày ---');
        await checkOverdueBorrows();
    });
};

const checkOverdueBorrows = async () => {
    try {
        const today = new Date();
        
        const result = await TheoDoiMuonSach.updateMany(
            { TrangThai: 'DangMuon', HanTra: { $lt: today } },
            { $set: { TrangThai: 'QuaHan' } }
        );

        if (result.modifiedCount > 0) {
            console.log(`--- Đã cập nhật trạng thái quá hạn cho ${result.modifiedCount} đơn mượn ---`);
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái quá hạn:', error);
    }
};

module.exports = { initCronJobs, checkOverdueBorrows };
