const mongoose = require('mongoose')

const recordingSchema = new mongoose.Schema({
  callId:    { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  url:       { type: String, required: true },
  filename:  { type: String },
  duration:  { type: Number, default: 0 },
  fileSize:  { type: Number },
  format:    { type: String, enum: ['mp3','wav'], default: 'mp3' },
  transcript:{ type: String },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Recording', recordingSchema)
