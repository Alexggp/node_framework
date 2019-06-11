const logger = require('../logger/logger').logger(__filename);
const config = require('../../config/config');
const postgreConnector = require('../connectors/postgresql-connector');

function postgresqlLoader(callback) {
  postgreConnector(config.sql.postgres, (err, result) => {
    if (err) {
      logger.error(err);
      return callback(err);
    }
    return callback(null, result);
  });
}
module.exports = postgresqlLoader;
