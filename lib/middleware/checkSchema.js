const logger = require('../logger/logger').logger(__filename);
var methods = require('../commons/methods');

module.exports = (setParams, schema) => (req, res, next) => {
 
/*
This middleware check the input params for route methods

@param setParams: function that returns the params object build in the caller route middleware.
@param schema: method schema.
*/

  const params = setParams(req);
  methods.validateRegister(params, schema, function (err, result) {
    if (!err.valid) {
      logger.warn('Validation error: '+JSON.stringify(err));
      res.status(400).send(err);
    }
    else {
      logger.debug('Successful schema validation');
      req.payload = params;
      next();
    }
  }); 
}



