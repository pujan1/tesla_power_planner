require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  databaseURL: process.env.MONGODB_URI,
};
