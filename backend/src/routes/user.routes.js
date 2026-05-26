const { Router } = require('express')
const controller = require('../controllers/user.controller')
const { authenticate } = require('../middlewares/auth')

const router = Router()

// TODO: Add user routes
// router.get('/', authenticate, controller.getAll)

module.exports = router
