const logger = require('../logger/logger').logger(__filename);
const config = require('../../config/config');
const redisConnector = require('../connectors/redis_connector');

let redisLink;

function redisLoader(callback) {
  redisConnector(config.redis, (err, result) => {
    if (err) {
      logger.error(err);
      callback(err);
    } else {
      redisLink = result;
      callback();
    }
  });
}
function getRedisLink() {
  return redisLink;
}

module.exports.redisLoader = redisLoader;
module.exports.getRedisLink = getRedisLink;
