const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Kết nối MongoDB thành công: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Lỗi kết nối cơ sở dữ liệu: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
