const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, unique: true },
  balance:   { type: Number, default: 0 },
  currency:  { type: String, default: 'INR' },
}, { timestamps: true })

module.exports = mongoose.model('Wallet', walletSchema)
