const { Op: { ne, is } } = require('sequelize');

module.exports = {
  deposit: async (req, res, next) => {
    const { Job, Contract, Profile } = req.app.get('models')
    const { type, id: ClientId } = req.profile
    const { value } = req.body

    if (type !== 'client') return next(new Error('You are not client. Increase balance is forbidden'))

    const contracts = await Contract.findAll({
      where: { ClientId, status: { [ne]: 'terminated' } },
      include: {
        model: Job,
        required: true,
        where: { paymentDate: { [is]: null } },
      },
    })

    let totalToBePaid = 0

    contracts.forEach(contract => {
      totalToBePaid += contract.Jobs.reduce((acc, c) => acc + c.price, 0)
    })

    if (value > (totalToBePaid / 4)) return next(new Error('Increment is higher than 25% of all pays. Forbidden'))

    const client = await Profile.findOne({ id: ClientId })
    client.balance += value
    await client.save()

    res.sendStatus(200)
  },
};