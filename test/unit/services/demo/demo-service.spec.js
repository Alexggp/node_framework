// testing lib/services/demo/service.js

const should = require('should');
const demoService = require('../../../../lib/services/demo/service.js');


describe('demoService middleware', () => {
  it('should call demo service and return the service respone', (done) => {
    const input = {
      message: 'test message'
    };

    demoService.entry(input, (err, result) => {
      should.not.exists(err);
      if (err) {
        done(err);
      } else {
        should.exists(result);
        result.should.be.equal('Demo service says: test message');
        done();
      }
    });
  });
});
