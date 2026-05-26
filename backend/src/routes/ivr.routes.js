const { Router } = require('express')
const controller = require('../controllers/ivr.controller')
const { authenticate } = require('../middlewares/auth')

const router = Router()

// TODO: Add ivr routes
// router.get('/', authenticate, controller.getAll)

module.exports = router
