import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import winston from 'winston';
import Config from '../config/config.js';


class ShardManager {
    constructor(dbName = Config.DB_NAME, dbUrl = Config.DB_URL, shardThreshold = Config.SHARD_THRESHOLD) {
        this.dbName = dbName;
        this.dbUrl = dbUrl;

        this.client = new MongoClient(dbUrl);
        this.db = this.client.db(dbName);
        this.shardThreshold = shardThreshold || 500 * 1024 * 1024; // 500MB threshold

        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'shardManager.log' })
            ]
        });
    }

    async enableSharding(collections) {
        try {
            // Enable sharding for the database
            await this.client.admin().command({ enableSharding: this.dbName });
    
            // Reference to the `config.collections` metadata
            const configDb = this.client.db('config');
            const shardedCollections = await configDb.collection('collections').find().toArray();
    
            // Iterate over each collection and its key
            for (const { collection, key } of collections) {
                const namespace = `${this.dbName}.${collection}`;
                
                // Check if the collection is already sharded
                const isSharded = shardedCollections.some(col => col._id === namespace);
                if (isSharded) {
                    this.logger.info(`Collection "${collection}" is already sharded. Skipping.`);
                    continue;
                }
    
                this.logger.info(`Configuring sharding for collection: ${collection}, key: ${key}`);
    
                // Ensure a unique index exists on the shard key
                await this.db.collection(collection).createIndex({ [key]: 1 }, { unique: true });
                
                const indexes = await this.db.collection(collection).listIndexes().toArray();
                const indexExists = indexes.some(idx => idx.key[key] === 1 && idx.unique);
                if (!indexExists) {
                    throw new Error(`Index on key "${key}" for collection "${collection}" is missing or not unique`);
                }
    
                // Shard the collection
                await this.client.admin().command({
                    shardCollection: namespace,
                    key: { [key]: 1 },
                });
    
                this.logger.info(`Sharding enabled for collection: ${collection} with key: ${key}`);
            }
        } catch (error) {
            this.logger.error(`Error enabling sharding: ${error.message}`);
            throw error;
        }
    }
        
    async addShardIfNeeded() {
        try {
            const currentSize = await this.getDatabaseSize();
            if (currentSize > this.shardThreshold) {
                const shardList = await this.getShardList();
                const shardName = `shard${shardList.length + 1}`;
                const shardUrl = Config[`${shardName.toUpperCase()}_URL`];
                if (shardUrl) {
                    await this.client.admin().command({ addShard: shardUrl });
                    this.logger.info(`Added new shard: ${shardName}`);
                } else {
                    this.logger.warn('Shard URL not configured. Skipping shard addition.');
                }
            }
        } catch (error) {
            this.logger.error(`Error adding shard: ${error.message}`);
            throw error;
        }
    }

    async removeUnusedShard() {
        try {
            const shardList = await this.getShardList();
            const stats = await this.client.admin().command({ getShardMap: 1 });
            for (const shard of shardList) {
                const shardUsage = stats.shards?.[shard]?.usage || 0;
                if (shardUsage < this.shardThreshold * 0.1) {
                    const result = await this.client.admin().command({ removeShard: shard });

                    if (result.state === 'completed') {
                        this.logger.info(`Removed shard: ${shard}`);
                    } else if (result.ok !== 1) {
                        this.logger.warn(`Shard ${shard} removal failed or is incomplete: ${JSON.stringify(result)}`);
                    } else {
                        this.logger.info(`Shard removal in progress: ${shard}`);
                    }
                }
            }
        } catch (error) {
            this.logger.error(`Error removing shard: ${error.message}`);
            throw error;
        }
    }

    async getDatabaseSize() {
        try {
            const dbStats = await this.db.command({ dbStats: 1 });
            return dbStats.dataSize || 0;
        } catch (error) {
            this.logger.error(`Error getting database size: ${error.message}`);
            throw error;
        }
    }

    async closeConnection() {
        await this.client.close();
        this.logger.info('MongoDB connection closed');
    }

    async getShardList() {
        try {
            const shardInfo = await this.client.admin().command({ listShards: 1 });
            return shardInfo.shards.map(shard => shard._id);
        } catch (error) {
            this.logger.error(`Error getting shard list: ${error.message}`);
            throw error;
        }
    }
}

export default ShardManager;
