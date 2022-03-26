const request = require('supertest')(require('src/app'));


describe('Testing product endpoints', () => {
  it('Should get 401 for no auth on endpoint', () => request.get('/no-thing').expect(401));
  it('Should get 404 for no valid endpoint', () => request
    .get('/no-thing')
    .set('profile_id', 2)
    .expect(404));
});