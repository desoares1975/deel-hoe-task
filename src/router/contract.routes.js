const router = require('express').Router()
const controller = require('../controllers/contract.controller')

router.get('/:id', controller.getContract)
router.get('/', controller.getContracts)

module.exports = router
