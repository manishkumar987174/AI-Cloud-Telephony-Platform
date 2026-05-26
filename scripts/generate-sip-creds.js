/**
 * Generate SIP credentials for agents
 * Usage: node scripts/generate-sip-creds.js <agentId>
 */
const crypto = require('crypto')

const agentId = process.argv[2]
if (!agentId) { console.error('Usage: node generate-sip-creds.js <agentId>'); process.exit(1) }

const sipPassword = crypto.randomBytes(12).toString('hex')
console.log({ extension: `1${Math.floor(Math.random() * 900 + 100)}`, sipPassword })