require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const swaggerDocs = require('./config/swagger');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/docgia', require('./routes/docGiaRoutes'));

app.get('/', (req, res) => {
    res.send('UniBorrow API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    swaggerDocs(app, PORT);
});
