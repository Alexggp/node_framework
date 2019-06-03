const logger = require('../../logger/logger').logger(__filename);
const getService = require('../../services/mobile/ping/service');

const get = [
  (req, res) => {
    getService.entry(req.body, function (err, result) {
      if(err) res.send(err);
      else res.sendStatus(result);
    });
  }
]


module.exports ={
  get
}