const { Router } = require('express')
const controller = require('../controllers/billing.controller')
const { authenticate } = require('../middlewares/auth')

const router = Router()

// TODO: Add billing routes
// router.get('/', authenticate, controller.getAll)

module.exports = router
