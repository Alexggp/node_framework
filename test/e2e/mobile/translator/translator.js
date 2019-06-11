const request = require('request');
const should = require('should');
const server = require('../../../../lib/backend');
const config = require('../../../../config/config');

const url = `http://localhost:${config.app.http}/ws3/`;
const timeout = 10000;

describe('#E2E translator, server start  ', () => {
  before(function (done) {
    this.timeout(timeout);
    if (!server.active()) server.start();
    setTimeout(() => {
      done();
    }, 5000);
  });
  it('#translator display all greetings', function (done) {
    this.timeout(timeout);
    const register = { from: 'en', to: 'es', message: 'hello world!' };
    const options = {
      uri: `${url}translate.route`,
      json: register,
    };
    request.post(options, (err, result) => {
      should.not.exists(err);
      if (err) {
        done(err);
      } else {
        should.exists(result);
        done();
      }
    });
  });

  it('#translator  error, to field is mandatory !', function (done) {
    this.timeout(timeout);
    const register = { from: 'en', message: 'hello world!' };
    const options = {
      uri: `${url}translate.route`,
      json: register,
    };
    request.post(options, (err, result) => {
      should.not.exists(err);
      if (err) {
        done(err);
      } else {
        should.exists(result.body.valid);
        result.body.valid.should.be.equal(false);
        done();
      }
    });
  });
});
