const { Router } = require('express')
const controller = require('../controllers/auth.controller')
const { authenticate } = require('../middlewares/auth')

const router = Router()

// TODO: Add auth routes
// router.get('/', authenticate, controller.getAll)

module.exports = router
