const logger = require('../logger/logger').logger(__filename);
const config = require('../../config/config');
const mysqlConnector = require('../connectors/mysql_connector');

function mysqlLoader(callback) {
  mysqlConnector(config.sql.mysql, (err, result) => {
    if (err) {
      logger.error(err);
      return callback(err);
    }
    return callback(null, result);
  });
}
module.exports = mysqlLoader;
