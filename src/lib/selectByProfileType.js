const selectByProfileType = (profile) => {
  if (profile.type === 'client') {
    const { dataValues: { id: ClientId } } = profile
    return { ClientId }
  }

  const { dataValues: { id: ContractorId } } = profile
  return { ContractorId }
}

module.exports = { selectByProfileType }
