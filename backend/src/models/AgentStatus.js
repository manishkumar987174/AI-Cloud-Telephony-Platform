const mongoose = require('mongoose')

const agentStatusSchema = new mongoose.Schema({
  agentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  status:    { type: String, enum: ['available','busy','away','offline'], default: 'offline' },
  extension: { type: String },
  activeCallId: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('AgentStatus', agentStatusSchema)
