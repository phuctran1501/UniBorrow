require('dotenv').config();

const app = require('./src/app');
const config = require('./src/config');
const connectDB = require('./src/config/db');

connectDB(config.db.uri);

app.listen(config.app.port, () => {
  console.log(`Server running on port ${config.app.port}`);
});
