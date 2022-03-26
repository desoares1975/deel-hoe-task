const findErrorCode = (errorMessage) => {
  const stringToCode = {
    'UNAUTHORIZED': 401,
    'FORBIDDEN': 403,
    'NOT FOUND': 404,
  }
  const strings = Object.keys(stringToCode)
  const parsedMessage = strings.filter(
    errorString => errorMessage.toUpperCase().includes(errorString)
  )

  return stringToCode[parsedMessage[0]] ?? 500
}

const errorHandler = (err, _, res, next) => {
  if (!err) return next(new Error('Call to error handler must pass an error object'));

  const status = findErrorCode(err.message)
  res.status(status).json(err.message)
}

module.exports = { errorHandler, findErrorCode }
