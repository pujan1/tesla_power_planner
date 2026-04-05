import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3001,
  databaseURL: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || 'fallback-dev-secret-do-not-use-in-prod',
};
