import { prisma } from '../config/database.js';
import logger from './logger.js';

/**
 * humanizeDatabaseRecord
 * Formats a database record to make it safe for API responses.
 * Converts BigInt fields to strings and floats/decimals to numbers.
 */
function humanizeDatabaseRecord(record) {
  if (!record) return record;

  // Handle arrays recursively
  if (Array.isArray(record)) {
    return record.map(item => humanizeDatabaseRecord(item));
  }

  // Handle objects recursively
  if (typeof record === 'object') {
    const formatted = {};
    for (const [key, value] of Object.entries(record)) {
      if (typeof value === 'bigint') {
        formatted[key] = value.toString();
      } else if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'Decimal') {
        formatted[key] = Number(value.toString());
      } else if (value instanceof Date) {
        formatted[key] = value.toISOString();
      } else if (value && typeof value === 'object') {
        formatted[key] = humanizeDatabaseRecord(value);
      } else {
        formatted[key] = value;
      }
    }
    return formatted;
  }

  return record;
}

/**
 * runSecureTransaction
 * Runs a transactional sequence of queries. If any query fails,
 * database updates will roll back automatically.
 */
async function runSecureTransaction(callback) {
  try {
    return await prisma.$transaction(async (tx) => {
      return await callback(tx);
    });
  } catch (error) {
    logger.error(`Database Transaction Failed: ${error.message}`);
    throw error;
  }
}

/**
 * enforceCompanyIsolation
 * Standard SaaS isolation helper that automatically adds companyId constraints to queries.
 */
function enforceCompanyIsolation(queryConditions, companyId) {
  if (!companyId) {
    throw new Error('SaaS Isolation error: companyId must be provided to isolate data');
  }

  const companyIdBigInt = typeof companyId === 'bigint' ? companyId : BigInt(companyId);

  return {
    ...queryConditions,
    companyId: companyIdBigInt
  };
}

export {
  humanizeDatabaseRecord,
  runSecureTransaction,
  enforceCompanyIsolation
};
