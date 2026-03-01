const mongoose = require('mongoose');

const connectDB = async (dbUri) => {
  try {
    await mongoose.connect(dbUri);
    console.log('Kết nối MongoDB thành công');
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.error('Kết nối MongoDB thất bại:');
    process.exit(1);
  }
};

module.exports = connectDB;
