const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'UniBorrow API is running' });
});

const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/sach.routes');
const borrowRoutes = require('./routes/theodoimuonsach.routes');
const nhaXuatBanRoutes = require('./routes/nhaxuatban.routes');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/publisher', nhaXuatBanRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
