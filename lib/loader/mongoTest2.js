const logger = require('../logger/logger').logger(__filename);
const MongoConnector = require('../connectors/mongodb_connector');
const config = require('../../config/config');

function MongodbLoader(callback) {
  const mC = new MongoConnector(logger,
    config.nosql.database_policy.retry,
    config.nosql.test2);
  mC.init((err) => {
    if (err) {
      logger.info(config.nosql.fail + JSON.stringify(config.nosql.test2));
      callback(err);
    } else {
      logger.info(config.nosql.ok + JSON.stringify(config.nosql.test2));
      callback();
    }
  });
}
module.exports = MongodbLoader;
