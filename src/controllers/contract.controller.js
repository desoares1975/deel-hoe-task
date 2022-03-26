const { Op } = require('sequelize');
const { selectByProfileType } = require('src/lib/selectByProfileType')

module.exports = {
  getContract: async (req, res, next) => {
    const { Contract } = req.app.get('models')
    const { id } = req.params
    const profileType = selectByProfileType(req.profile)
    const contract = await Contract.findOne({ where: { id, ...profileType } } )
    if(!contract) return next(new Error('Contract Not Found'))

    res.json(contract)
  },

  getContracts: async (req, res) => {
    const { Contract } = req.app.get('models')
    const profileType = selectByProfileType(req.profile)
    const status = { [Op.ne]: 'terminated' }
    const contracts = await Contract.findAll({ where: { ...profileType, status } } )

    res.json(contracts)
  },
};