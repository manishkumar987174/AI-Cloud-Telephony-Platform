import { prisma } from '../config/database.js';
import logger from '../utils/logger.js';

async function debitCall(companyId, callId, durationSeconds, ratePerMinute) {
  const billableMinutes = Math.ceil(durationSeconds / 60);
  const amount = billableMinutes * ratePerMinute;
  
  const companyIdBigInt = BigInt(companyId);

  // Execute in a transaction to prevent race conditions
  const result = await prisma.$transaction(async (tx) => {
    // 1. Fetch wallet balance
    const wallet = await tx.wallet.findUnique({
      where: { companyId: companyIdBigInt }
    });

    if (!wallet || Number(wallet.balance) < amount) {
      throw new Error('Insufficient balance');
    }

    // 2. Decrement balance
    const updatedWallet = await tx.wallet.update({
      where: { companyId: companyIdBigInt },
      data: { balance: { decrement: amount } }
    });

    // 3. Log transaction ledger
    await tx.transaction.create({
      data: {
        companyId: companyIdBigInt,
        type: 'debit',
        amount: amount,
        description: `Call charge for call ${callId}`
      }
    });

    return updatedWallet;
  });

  logger.info(`Debited ${amount} from company ${companyId} for call ${callId}`);
  return { amount, balance: result.balance };
}

async function creditWallet(companyId, amount, reference) {
  const companyIdBigInt = BigInt(companyId);

  const result = await prisma.$transaction(async (tx) => {
    // 1. Update wallet balance or create it
    const wallet = await tx.wallet.upsert({
      where: { companyId: companyIdBigInt },
      update: { balance: { increment: amount } },
      create: { companyId: companyIdBigInt, balance: amount }
    });

    // 2. Create transaction record
    await tx.transaction.create({
      data: {
        companyId: companyIdBigInt,
        type: 'credit',
        amount: amount,
        description: `Wallet recharge: ${reference}`
      }
    });

    return wallet;
  });

  return { balance: result.balance };
}

export { debitCall, creditWallet };