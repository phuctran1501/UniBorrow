const config = {
  app: {
    port: process.env.PORT || 5000
  },
  db: {
    uri: process.env.MONGO_URI
  }
};

module.exports = config;
