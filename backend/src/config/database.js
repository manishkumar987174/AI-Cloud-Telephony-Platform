import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
    { level: 'error', emit: 'stdout' },
  ],
});

// Log queries in development mode
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.info(`Query: ${e.query} -- Params: ${e.params}`);
  });
}

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('MySQL Database Connected successfully (Prisma)');
  } catch (error) {
    logger.error(`MySQL connection error: ${error.message}`);
    process.exit(1);
  }
};

export { prisma, connectDB };
