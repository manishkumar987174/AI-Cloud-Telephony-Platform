require('dotenv').config()
const app = require('./app')
const { connectDB } = require('./config/database')
const { connectRedis } = require('./config/redis')
const { initSocket } = require('./socket')
const { initESL } = require('./telephony/esl/eslClient')
const logger = require('./utils/logger')

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB()
  await connectRedis()
  const server = app.listen(PORT, () => {
    logger.info(Server running on port )
  })
  initSocket(server)
  initESL()
}

start().catch((err) => {
  logger.error('Startup error:', err)
  process.exit(1)
})
