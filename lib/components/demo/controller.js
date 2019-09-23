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
post.insertMiddleware((req, res, next) => {
  // This is an example middleware. You can whrite some code heare if you need it.
  next();
});
post.insertMiddleware((req, res) => {
  // This is the final middleware. Notice that it hasn´t "next" argument.
  demoService.entry(res.locals.params, (err, result) => {
    if (err) res.customResponse.generic(err.status, err.error);
    else res.customResponse.success(result);
  });
});


module.exports = {
  get: get.getMiddlewaresArray(),
  post: post.getMiddlewaresArray()
};
