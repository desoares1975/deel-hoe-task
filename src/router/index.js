const router = require('express').Router()
const contract = require('./contract.routes')
const job = require('./jobs.routes')
const balance = require('./balance.routes')
const admin = require('./admin.routes')
const { getProfile } = require('src/middleware/getProfile')
const { errorHandler } = require('src/middleware/errorHandler')

router.use('/admin', admin)
.use(getProfile)
.use('/balances', balance)
.use('/contracts', contract)
.use('/jobs', job)
.use(errorHandler)

module.exports = router
