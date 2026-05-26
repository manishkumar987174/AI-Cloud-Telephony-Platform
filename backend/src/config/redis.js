const { createClient } = require('redis');
const logger = require('../utils/logger');

let redisClient = null;

const connectRedis = async () => {
  try {
    const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = createClient({
      url: redisURL
    });

    redisClient.on('error', (err) => logger.error('Redis Client Error: %s', err.message || err));
    redisClient.on('connect', () => logger.info('Redis Client Connected'));

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error(`Redis connection error: ${error.message}`);
    process.exit(1);
  }
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };
