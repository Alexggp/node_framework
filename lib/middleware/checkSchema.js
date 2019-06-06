const logger = require('../logger/logger').logger(__filename);
const validator = require('../utils/validator');


module.exports = (setParams, schema) => (req, res, next) => {
 
/*
This middleware check the input params for route methods

@param setParams: function that returns the params object build in the route controller.
@param schema: method schema.
*/

const params = setParams(req);
  validateRegister(params, schema, function (err, result) {
    if (!err.valid) {
      logger.warn('Validation error: '+JSON.stringify(err));
      res.customResponse.badRequest(err);
    }
    else {
      logger.debug('Successful schema validation');
      // params object build in the controller is passed in res.locals.params
      // to the next middleware in the controller array
      res.locals.params = params;
      next();
    }
  }); 
}


function validateRegister(register, schema, callback) {
	var result = validator.validate(register, schema);
	callback(result, register);
}
