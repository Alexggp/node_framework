const logger = require('../../logger/logger').logger(__filename);
const checkSchema = require('../../middleware/checkSchema');
const schema = require('./schema');


const demoService = require('../../services/demo/service');

const get = [
  (req, res) => {
    res.customResponse.success('Hellow world!');
  }
]

const post = [
  checkSchema((req)=>req.body,schema.post),    //validation middleware, allways at first position in the array
  (req, res) => {
    demoService.entry(req.payload, function (err, result) {
      if(err) res.customResponse.generic(500,err);
      else res.customResponse.success(result);
    });
  }
]


module.exports ={
  get,
  post
}