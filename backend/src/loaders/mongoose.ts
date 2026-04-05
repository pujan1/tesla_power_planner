import mongoose from 'mongoose';
import config from '../config';

const init = async () => {
  if (!config.databaseURL) {
    console.warn('⚠️ No MONGODB_URI found. The database connection was skipped.');
    return;
  }

  try {
    const connection = await mongoose.connect(config.databaseURL);
    return connection.connection.db;
  } catch (error) {
    console.error('❌ MongoDB Connection Error: ', error);
    process.exit(1);
  }
};

export default init;
