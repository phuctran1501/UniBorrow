const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'UniBorrow API is running' });
});

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
