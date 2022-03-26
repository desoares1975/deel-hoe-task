const { findErrorCode } = require('src/middleware/errorHandler')

describe('errorHandelr', () => {
  it('Should parse the correct statuses', () => {
    const error500 = findErrorCode('something unexpected happend...')
    const error404 = findErrorCode('The One Ring wos not found (after Mordor)')
    const error404Two = findErrorCode('What ever... Not Found')
    const error401 = findErrorCode('What are you doing? That\'s UNAUTHORIzed man...')
    const error403 = findErrorCode('Eating over the keyboadr is forbidden')

    expect(error401).toBe(401)
    expect(error403).toBe(403)
    expect(error404).toBe(404)
    expect(error500).toBe(500)
    expect(error404Two).toBe(404)
  })
});