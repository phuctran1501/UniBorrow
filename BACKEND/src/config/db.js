const mongoose = require('mongoose');

const connectDB = async (dbUri) => {
  try {
    await mongoose.connect(dbUri);
    console.log('MongoDB Connected');
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.error('Database connection failed');
    process.exit(1);
  }
};

module.exports = connectDB;
