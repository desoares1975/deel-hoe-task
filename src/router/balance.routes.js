const router = require('express').Router()
const controller = require('src/controllers/balance.controller')

router.post('/deposit/:userId', controller.deposit)

module.exports = router
