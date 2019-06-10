/* eslint import/no-unresolved: 0 */ // --> OFF remove after installing mysql
const mysql = require('mysql');
const logger = require('../logger/logger').logger(__filename);
const mysqlPool = require('./pool');

function createClient(db, callback) {
  try {
    const pool = mysql.createPool(db);
    logger.debug(`create pool at:${JSON.stringify(db)}`);
    callback(null, pool);
  } catch (error) {
    logger.error(error);
    callback(error);
  }
}


function mysqlConnector(db, callback) {
  createClient(db, (err, pool) => {
    if (err) {
      logger.error(err);
      callback(err);
    } else {
      pool.query('SELECT 1+1', (error, result) => { // test pool ok
        if (err) callback(err);
        else {
          logger.debug(`connected to database:${JSON.stringify(db)}`);
          mysqlPool.set(db, pool);
          callback(null, pool);
        }
      });
    }
  });
}

module.exports = mysqlConnector;
