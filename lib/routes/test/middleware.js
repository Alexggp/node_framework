const logger = require('../../logger/logger').logger(__filename);
const checkSchema = require('./../../middleware/checkSchema');
const schema = require('./schema');


const getService = require('../../services/mobile/ping/service');

const get = [
  (req, res) => {
    getService.entry(req.params, function (err, result) {
      if(err) res.send(err);
      else res.sendStatus(result);
    });
  }
]

const post = [
  checkSchema((req)=>req.body,schema.post),    //validation middleware, allways at first position in the array
  (req, res) => {
    getService.entry(req.payload, function (err, result) {
      if(err) res.send(err);
      else res.sendStatus(result);
    });
  }
]


module.exports ={
  get,
  post
}