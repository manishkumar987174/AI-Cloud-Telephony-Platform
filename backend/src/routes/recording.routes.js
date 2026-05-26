const { Router } = require('express')
const controller = require('../controllers/recording.controller')
const { authenticate } = require('../middlewares/auth')

const router = Router()

// TODO: Add recording routes
// router.get('/', authenticate, controller.getAll)

module.exports = router
