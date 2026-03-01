require('dotenv').config();

const app = require('./src/app');
const config = require('./src/config');
const connectDB = require('./src/config/db');

connectDB(config.db.uri);

app.listen(config.app.port, () => {
  console.log(`Server đang chạy trên cổng ${config.app.port}`);
});
