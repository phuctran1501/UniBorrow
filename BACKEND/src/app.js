const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'UniBorrow API đang chạy' });
});

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const createBooksRoutes = require('./routes/book.routes');
app.use('/api/book', createBooksRoutes);

const getBooksRoutes = require('./routes/book.routes');
app.use('/api/book', getBooksRoutes);

const borrowRoutes = require('./routes/borrow.routes');
app.use('/api/borrow', borrowRoutes);

const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
