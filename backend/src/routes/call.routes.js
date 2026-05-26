const { Router } = require('express')
const controller = require('../controllers/call.controller')
const { authenticate } = require('../middlewares/auth')

const router = Router()

// TODO: Add call routes
// router.get('/', authenticate, controller.getAll)

module.exports = router
