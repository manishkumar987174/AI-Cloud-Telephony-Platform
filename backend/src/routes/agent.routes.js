const { Router } = require('express')
const controller = require('../controllers/agent.controller')
const { authenticate } = require('../middlewares/auth')

const router = Router()

// TODO: Add agent routes
// router.get('/', authenticate, controller.getAll)

module.exports = router
