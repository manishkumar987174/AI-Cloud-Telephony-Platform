const mongoose = require('mongoose')

const callLogSchema = new mongoose.Schema({
  callId:       { type: String, required: true, unique: true },
  companyId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  campaignId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  contactId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  agentId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  direction:    { type: String, enum: ['inbound','outbound'], required: true },
  fromNumber:   { type: String, required: true },
  toNumber:     { type: String, required: true },
  status:       { type: String, enum: ['initiated','ringing','answered','no_answer','busy','failed','voicemail'], default: 'initiated' },
  duration:     { type: Number, default: 0 },
  billDuration: { type: Number, default: 0 },
  cost:         { type: Number, default: 0 },
  recordingUrl: { type: String },
  transcript:   { type: String },
  hangupCause:  { type: String },
  startTime:    { type: Date },
  answerTime:   { type: Date },
  endTime:      { type: Date },
}, { timestamps: true })

module.exports = mongoose.model('CallLog', callLogSchema)
