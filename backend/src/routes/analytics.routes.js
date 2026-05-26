const { Router } = require('express')
const controller = require('../controllers/analytics.controller')
const { authenticate } = require('../middlewares/auth')

const router = Router()

// TODO: Add analytics routes
// router.get('/', authenticate, controller.getAll)

module.exports = router
