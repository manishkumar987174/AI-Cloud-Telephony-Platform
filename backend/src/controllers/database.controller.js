import { prisma } from '../config/database.js';
import { humanizeDatabaseRecord } from '../utils/databaseHelper.js';
import { runSeed } from '../../prisma/seed.js';
import logger from '../utils/logger.js';

/**
 * getDatabaseDiagnostics
 * Runs diagnostics on the MySQL database and retrieves statistics
 * about Phase 2 tables, relationships, and SaaS tenant counts.
 */
export const getDatabaseDiagnostics = async (req, res, next) => {
  try {
    const startTime = Date.now();
    
    // 1. Check connection using raw query
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;

    // 2. Query record counts in parallel
    const [
      companyCount,
      userCount,
      campaignCount,
      contactCount,
      callLogCount,
      recordingCount,
      walletCount,
      transactionCount
    ] = await Promise.all([
      prisma.company.count(),
      prisma.user.count(),
      prisma.campaign.count(),
      prisma.contact.count(),
      prisma.callLog.count(),
      prisma.recording.count(),
      prisma.wallet.count(),
      prisma.transaction.count()
    ]);

    // 3. Fetch latest call logs for diagnostic preview (humanized)
    const latestCalls = await prisma.callLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        company: { select: { name: true } },
        campaign: { select: { name: true } },
        agent: { select: { name: true } }
      }
    });

    // 4. Fetch latest transactions for diagnostic preview (humanized)
    const latestTransactions = await prisma.transaction.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        company: { select: { name: true } }
      }
    });

    logger.info(`Database diagnostics retrieved in ${latencyMs}ms`);

    res.status(200).json({
      success: true,
      data: {
        connection: {
          status: 'healthy',
          provider: 'mysql',
          latencyMs
        },
        counts: {
          companies: companyCount,
          users: userCount,
          campaigns: campaignCount,
          contacts: contactCount,
          callLogs: callLogCount,
          recordings: recordingCount,
          wallets: walletCount,
          transactions: transactionCount
        },
        preview: {
          latestCalls: humanizeDatabaseRecord(latestCalls),
          latestTransactions: humanizeDatabaseRecord(latestTransactions)
        }
      }
    });
  } catch (error) {
    logger.error(`Database diagnostics failed: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: 'Database Diagnostics Failed',
        details: error.message
      }
    });
  }
};

/**
 * seedDatabase
 * Programmatically triggers the database seeder to repopulate the tables
 * with realistic humanized mock records.
 */
export const seedDatabase = async (req, res, next) => {
  try {
    logger.info('Programmatic database seeding triggered via API');
    
    const result = await runSeed(prisma);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    logger.error(`API-triggered database seeding failed: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: 'Database Programmatic Seeding Failed',
        details: error.message
      }
    });
  }
};
