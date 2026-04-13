import mongoose from 'mongoose';
import config from '../config';
import User from '../api/users/user.model';

const promoteUser = async (username: string) => {
  if (!config.databaseURL) {
    console.error('❌ MONGODB_URI not found in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(config.databaseURL);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ username });
    if (!user) {
      console.error(`❌ User '${username}' not found`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    console.log(`🚀 User '${username}' has been promoted to admin successfully!`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error promoting user:', error);
    process.exit(1);
  }
};

const username = process.argv[2];
if (!username) {
  console.log('Usage: npx ts-node src/scripts/promote-admin.ts <username>');
  process.exit(1);
}

promoteUser(username);
