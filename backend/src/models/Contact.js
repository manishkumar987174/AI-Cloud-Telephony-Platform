const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  phone:      { type: String, required: true },
  email:      { type: String },
  city:       { type: String },
  state:      { type: String },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  companyId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  status:     { type: String, enum: ['pending','dialing','answered','failed','dnc'], default: 'pending' },
  customFields: { type: Map, of: String },
  retryCount: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Contact', contactSchema)
