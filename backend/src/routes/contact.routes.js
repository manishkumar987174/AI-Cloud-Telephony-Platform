const { Router } = require('express')
const controller = require('../controllers/contact.controller')
const { authenticate } = require('../middlewares/auth')

const router = Router()

// TODO: Add contact routes
// router.get('/', authenticate, controller.getAll)

module.exports = router
