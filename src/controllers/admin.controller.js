const { Op: { between } } = require('sequelize');
const { sequelize } = require('src/models/model')

module.exports = {
  bestClients: async (req, res, next) => {
    const { Job, Contract, Profile } = req.app.get('models')
    const { start, end, limit = 2 } = req.query
    try {
      const jobsSums = await Contract.findAll({
        attributes: [
          'ClientId',
          [sequelize.fn('sum', sequelize.col('Jobs.price')), 'total'],
        ],
        include: [
          {
            model: Job,
            require: true,
            where: { paymentDate: { [between]: [start, end] } },
            attributes: ['price'],
          },
          {
            model: Profile,
            as : 'Client',
            foreignKey:'ClientId',
            attributes: ['id', 'firstName', 'lastName'],
          }
        ],
        group: ['Contract.ClientId'],
        order: [[sequelize.col('total'), 'DESC']],
      })
      const sumResult = jobsSums.slice(0, limit).map(jS => {
        const { Client: { id, firstName, lastName }, total: paid } = jS.dataValues
        return {
          id,
          fullName: `${firstName} ${lastName}`,
          paid
        }
      })
      res.json(sumResult)
    } catch (e) {
      console.log(e)
      next(e)
    }
  },

  bestContractors: async (req, res, next) => {
    const { Job, Contract, Profile } = req.app.get('models')
    const { start, end } = req.query
    try {
      const jobsSums = await Contract.findAll({
        attributes: [
          'ContractorId',
          [sequelize.fn('sum', sequelize.col('Jobs.price')), 'total'],
        ],
        include: [
          {
            model: Profile,
            as: 'Contractor',
            foreignKey: 'ContractorId',
            require: true,
            attributes: ['id', 'firstName', 'lastName'],
          },
          {
            model: Job,
            require: true,
            where: { paymentDate: { [between]: [start, end] } },
            attributes: ['price']
          },
        ],
        group: ['Contract.ContractorId'],
        order: [[sequelize.col('total'), 'DESC']],
      })

      if (!jobsSums.length) return next(new Error('Payments in the selected interval not found'))

      const {
        dataValues: {
          total,
          Contractor: {
            firstName,
            lastName,
          },
          ContractorId: id,
        }
      } = jobsSums[0]

      res.json({
        id,
        fullName: `${firstName} ${lastName}`,
        total,
      })
    } catch (e) {
      console.log(e)
      next(e)
    }
  }
};
