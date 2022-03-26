const router = require('express').Router()
const controller = require('src/controllers/admin.controller')

router.get('/best-clients', controller.bestClients)
router.get('/best-profession', controller.bestContractors)

module.exports = router
