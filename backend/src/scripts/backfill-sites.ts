import mongoose from 'mongoose';
import User from '../api/users/user.model';
import Site from '../api/sites/site.model';
import config from '../config';

const runBackfill = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.databaseURL as string);
    console.log('Connected.');
    
    await Site.deleteMany({});
    console.log('Cleared existing Site collection.');

    const cursor = User.find().cursor();
    let totalMigrated = 0;

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      const user = doc as any; // any because we are deprecating sites in interface
      if (user.sites && user.sites.length > 0) {
        console.log(`Migrating ${user.sites.length} sites for user ${user.username}`);
        
        for (const siteData of user.sites) {
          await Site.create({
            _id: new mongoose.Types.ObjectId().toString(),
            ownerUsername: user.username,
            name: siteData.name,
            devices: siteData.devices,
            updatedAt: siteData.updatedAt
          });
          totalMigrated++;
        }
      }
    }

    console.log(`Backfill complete. Migrated ${totalMigrated} sites.`);
  } catch (err) {
    console.error('Error during backfill: ', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
};

runBackfill();
