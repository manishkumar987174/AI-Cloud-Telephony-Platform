const mongoose = require('mongoose')

const ivrSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  greeting:  { type: String },
  options: [{
    key:    { type: String },
    label:  { type: String },
    action: { type: String, enum: ['queue','agent','ivr','hangup','voicemail'] },
    target: { type: String },
  }],
  timeout:    { type: Number, default: 10 },
  maxRetries: { type: Number, default: 3 },
}, { timestamps: true })

module.exports = mongoose.model('IVR', ivrSchema)
