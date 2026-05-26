const Wallet = require('../models/Wallet')
const Transaction = require('../models/Transaction')
const logger = require('../utils/logger')

async function debitCall(companyId, callId, durationSeconds, ratePerMinute) {
  const billableMinutes = Math.ceil(durationSeconds / 60)
  const amount = billableMinutes * ratePerMinute
  const wallet = await Wallet.findOneAndUpdate(
    { companyId, balance: { $gte: amount } },
    { $inc: { balance: -amount } },
    { new: true }
  )
  if (!wallet) throw new Error('Insufficient balance')
  await Transaction.create({ companyId, type: 'debit', amount, description: 'Call charge', reference: callId, callId, balance: wallet.balance })
  logger.info(`Debited ${amount} from company ${companyId} for call ${callId}`)
  return { amount, balance: wallet.balance }
}

async function creditWallet(companyId, amount, reference) {
  const wallet = await Wallet.findOneAndUpdate(
    { companyId },
    { $inc: { balance: amount } },
    { new: true, upsert: true }
  )
  await Transaction.create({ companyId, type: 'credit', amount, description: 'Wallet recharge', reference, balance: wallet.balance })
  return { balance: wallet.balance }
}

module.exports = { debitCall, creditWallet }