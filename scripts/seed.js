/**
 * Database seeder - Creates initial super admin and company
 * Usage: node scripts/seed.js
 */
require('dotenv').config({ path: './backend/.env' })
const mongoose = require('mongoose')

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')
  // TODO: Seed initial data
  console.log('Seeding complete!')
  process.exit(0)
}

seed().catch(console.error)