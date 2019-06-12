/*
·This file contains every endpoint controller.
·Those controllers are arrays of middlewares. Middlewares are (res,req,next) => {} functions.
  https://expressjs.com/en/guide/using-middleware.html
·Data pass from a middleware to another in res.locals object.
·If the end point has params you should pass the checkSchema middleware at first.
    ·The first parameter of this middleware is a function where you shoud return the params object
      in this case req.body ( (req)=>req.body )
    ·If the input data pass checkSchema, the params object will be located in res.locals.params to
      used in the middlewares bellow.
    ·You can add as many middlewares to the array as needed. The last one should have not next()
      argument
  and should make the response of the end point call.
·If one method controller is too large or complex, you can locate it in another file just alone.
*/


const checkSchema = require('../../middleware/check-schema');
const schema = require('./schema');
const demoService = require('../../services/demo/service');

const get = [
  (req, res) => {
    res.customResponse.success('Hello world!');
  },
];

const post = [
  // validation middleware, always at first position in the array
  checkSchema(req => req.body, schema.post),
  (req, res, next) => {
    /*
    This is an example middleware. You can whrite some code heare if you need it.
    next() sentence call the next middleware in the array
    */
    next();
  },
  (req, res) => {
    /*
    This is the final middleware. Notice that it hasn´t "next" argument.

    In this case, it calls the demoService and when it recieves the result
    makes the request response.

    The service input data is passed from the res.locals.params object created in
    checkSchema middleware, actually you can pass anything you want, req.body or
    whatever, but remember that res.locals.params are verified by the schema.
    */
    demoService.entry(res.locals.params, (err, result) => {
      if (err) res.customResponse.generic(err.status, err.error);
      else res.customResponse.success(result);
    });
  },
];


module.exports = {
  get,
  post,
};
