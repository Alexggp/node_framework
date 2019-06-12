// testing /api/demo endpoint methods

const supertest = require('supertest');

const request = supertest('http://localhost:3000');


describe('demo endopoint tests', () => {
  context('GET', () => {
    it('should return a 200 ok status', (done) => {
      request.get('/api/demo')
        .expect(200, {
          code: 200,
          message: 'OK',
          data: 'Hello world!'
        }, done);
    });
  });
  context('POST', () => {
    it('should return a 200 ok status', (done) => {
      const data = { message: 'test' };

      request.post('/api/demo')
        .send(data)
        .expect(200, {
          code: 200,
          message: 'OK',
          data: 'Demo service says: test'
        }, done);
    });
  });
});
