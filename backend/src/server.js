import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { initSocket } from './socket/index.js';
import { initESL } from './telephony/esl/eslClient.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  await connectRedis();
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
  initSocket(server);
  initESL();
}

start().catch((err) => {
  logger.error('Startup error:', err);
  process.exit(1);
});
