const mongoose = require('mongoose')

const campaignSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  companyId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  status:     { type: String, enum: ['draft','running','paused','completed','failed'], default: 'draft' },
  type:       { type: String, enum: ['outbound','inbound','broadcast','ai'], default: 'outbound' },
  dialerId:   { type: String },
  schedule:   { startAt: Date, endAt: Date },
  totalContacts: { type: Number, default: 0 },
  dialedCount:   { type: Number, default: 0 },
  answeredCount: { type: Number, default: 0 },
  failedCount:   { type: Number, default: 0 },
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

module.exports = mongoose.model('Campaign', campaignSchema)
