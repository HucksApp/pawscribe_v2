import Config from '../config/config.js';
import mongoose from 'mongoose';
import ShardManager from './setupDb.js';



if (Config.DB_TYPE === "self"){
  const collectionsToShard = [
    { collection: 'users', key: '_id' },
    { collection: 'files', key: 'hash' },
    { collection: 'folders', key: '_id' },
    { collection: 'file_content', key: 'hash' },
  ];
  
  const shardManager = new ShardManager();
  
  shardManager.enableSharding(collectionsToShard)
    .then(() => console.log('Sharding configured successfully.'))
    .catch(err => console.error('Error configuring sharding:', err))
    .finally(() => shardManager.closeConnection());
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(Config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};