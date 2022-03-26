const router = require('express').Router()
const controller = require('../controllers/job.controller')

router.get('/unpaid', controller.getUnpaidJobs)
router.post('/:job_id/pay', controller.payJob)

module.exports = router
