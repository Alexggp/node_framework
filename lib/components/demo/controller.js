/*
·This file contains every endpoint controller.
·Those controllers export arrays of middlewares. Middlewares are (res,req,next) => {} functions.
  https://expressjs.com/en/guide/using-middleware.html
·Data pass from a middleware to another in res.locals object.
·If the end point has params you should call setInput and validateSchema methods
·You can add as many middlewares to the controller as needed. The last one should have not next()
  argument and should make the response of the end point call.
·If one controller is too large or complex, you can locate it in another file just alone.
·You also can pass the middlewares array, or just one middleware, to the constructor directly,
  as you can see in get Controller example.
*/


const Controller = require('../../utils/controller-class');
const schema = require('./schema');
const demoService = require('../../services/demo/service');

const get = new Controller(
  (req, res) => {
    res.customResponse.success('Hello world!');
  }
);

const post = new Controller();
post.setInput(req => req.body);
post.validateSchema(schema.post);
// insertMiddleware method accepts a middleware or an array of middlewares
post.insertMiddleware((req, res, next) => {
  /*
  This is an example middleware. You can whrite some code heare if you need it.
  */
  next();
});
post.insertMiddleware((req, res) => {
  /*
  This is the final middleware. Notice that it hasn´t "next" argument.

  In this case, it calls the demoService and when it recieves the result
  makes the request response.

  The service input data is passed from the res.locals.params object created in
  setInput Controller method, actually you can pass anything you want, req.body or
  whatever, but remember that res.locals.params is verified by the schema.
  */
  demoService.entry(res.locals.params, (err, result) => {
    if (err) res.customResponse.generic(err.status, err.error);
    else res.customResponse.success(result);
  });
});

module.exports = {
  get: get.getMiddlewaresArray(),
  post: post.getMiddlewaresArray()
};
