const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'UniBorrow API is running' });
});

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
