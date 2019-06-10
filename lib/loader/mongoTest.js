const logger = require('../logger/logger').logger(__filename);
const MongoConnector = require('../connectors/mongodb_connector');
const config = require('../../config/config');

function mongodbLoader(callback) {
  const mC = new MongoConnector(logger,
    config.nosql.database_policy.retry,
    config.nosql.test);
  mC.init((err) => {
    if (err) {
      logger.error(config.nosql.fail + JSON.stringify(config.nosql.test));
      callback(err);
    } else {
      logger.info(config.nosql.ok + JSON.stringify(config.nosql.test));
      callback();
    }
  });
  // callback();
}

module.exports = mongodbLoader;
