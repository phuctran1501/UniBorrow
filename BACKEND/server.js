require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initCronJobs } = require('./utils/cronJobs');

const swaggerDocs = require('./config/swagger');

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use('/api/docgia', require('./routes/docGiaRoutes')); 
app.use('/api/sach', require('./routes/sachRoutes'));       
app.use('/api/nhanvien', require('./routes/nhanVienRoutes')); 
app.use('/api/nhaxuatban', require('./routes/nhaXuatBanRoutes')); 
app.use('/api/ai', require('./routes/aiRoutes')); 
app.get('/', (req, res) => {
    res.send('UniBorrow API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng: ${PORT}`); 
    swaggerDocs(app, PORT);
    initCronJobs();
});
