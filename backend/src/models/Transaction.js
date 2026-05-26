const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  companyId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  type:        { type: String, enum: ['credit','debit'], required: true },
  amount:      { type: Number, required: true },
  description: { type: String },
  reference:   { type: String },
  callId:      { type: String },
  balance:     { type: Number },
}, { timestamps: true })

module.exports = mongoose.model('Transaction', transactionSchema)
