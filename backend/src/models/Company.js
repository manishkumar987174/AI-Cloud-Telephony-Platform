const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  plan:     { type: String, enum: ['free','starter','pro','enterprise'], default: 'free' },
  wallet:   { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  settings: {
    ratePerMinute:   { type: Number, default: 1 },
    maxAgents:       { type: Number, default: 10 },
    maxConcurrent:   { type: Number, default: 5 },
    recordingEnabled: { type: Boolean, default: true },
  },
}, { timestamps: true })

module.exports = mongoose.model('Company', companySchema)
