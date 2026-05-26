const { Router } = require('express')
const controller = require('../controllers/campaign.controller')
const { authenticate } = require('../middlewares/auth')

const router = Router()

// TODO: Add campaign routes
// router.get('/', authenticate, controller.getAll)

module.exports = router
