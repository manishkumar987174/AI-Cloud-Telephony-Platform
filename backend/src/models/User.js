const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, select: false },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  role:      { type: String, enum: ['super_admin','admin','agent'], default: 'agent' },
  isActive:  { type: Boolean, default: true },
  extension: { type: String },
  sipPassword: { type: String, select: false },
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', userSchema)
