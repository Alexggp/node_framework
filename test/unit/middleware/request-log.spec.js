// testing lib/middleware/custom-response.js

const assert = require('assert');
const customResponse = require('../../../lib/middleware/custom-response.js');

describe('customResponse middleware', () => {
  it('should add to res a customResponse object with serval functions', () => {
    const req = {};
    const res = {};
    customResponse(req, res, () => {});

    // in this example we use node assert library.

    assert.ok(res.customResponse);
    assert.ok(res.customResponse.success);
    assert.ok(res.customResponse.generic);
    assert.ok(res.customResponse.created);
    assert.ok(res.customResponse.badRequest);
    assert.ok(res.customResponse.unauthorized);
    assert.ok(res.customResponse.forbidden);
    assert.ok(res.customResponse.conflict);
    assert.ok(res.customResponse.failedDependency);
    assert.ok(res.customResponse.internalServerError);
  });
});
