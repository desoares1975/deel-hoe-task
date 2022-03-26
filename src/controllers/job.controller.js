const { Op: { is, ne, eq } } = require('sequelize');
const { selectByProfileType } = require('src/lib/selectByProfileType')
const { sequelize } = require('src/models/model')

module.exports = {
  getUnpaidJobs: async (req, res, next) => {
    const { Job, Contract } = req.app.get('models')
    const profileType = selectByProfileType(req.profile)
    // here I assume that, by default,
    // ***active contracts only*** are the ones "in_progress", not new or any other
    const status = { [eq]: 'in_progress' }
    try {
      const contracts = await Contract.findAll({
        where: { ...profileType, status },
        attributes: [],
        include: {
          model: Job,
          where: { paymentDate: { [is]: null } },
        },
      })

      res.json(contracts.map(c => c.Jobs).flat())
    } catch(e) {
      console.log(e)
      next(e)
    }
  },

  payJob: async (req, res, next) => {
    const { type, id: ClientId } = req.profile
    if (type !== 'client') return next(new Error('You are not client. Pay is forbidden'))

    const { Job, Profile, Contract } = req.app.get('models')
    const { job_id: id } = req.params
      try {
        return sequelize.transaction(async (txn) => {
          const job = await Job.findOne({
            where: { id, paymentDate: { [is]: null } },
            include: {
              model: Contract,
              required: true,
              // assume client should not pay terminated contract
              where: { ClientId, status: { [ne]: 'terminated' } },
              attributes: [ 'ContractorId', 'ClientId', 'status' ],
            }
          });

          if (!job) return next(new Error('Job Not Found'))

          const client = await Profile.findOne({ id: ClientId })
          const jobTotalPay = job.price

          if (client.balance < jobTotalPay) return next(new Error('Not Enough balance. Forbidden'))

          const contractor = await Profile.findOne({ id: job.Contract.ContractorId })

          contractor.balance += jobTotalPay
          await contractor.save()
          client.balance -= jobTotalPay
          await client.save()
          job.paymentDate = new Date()
          job.paid = true
          await job.save()

          await txn.afterCommit(() => res.sendStatus(200))
      })
    } catch (e) {
      next(e)
    }
  },
};