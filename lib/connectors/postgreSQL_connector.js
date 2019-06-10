/* eslint import/no-unresolved: 0 */ // --> OFF remove after installing pg
const pg = require('pg');
const logger = require('../logger/logger').logger(__filename);
const postgreSQLPool = require('./pool');


function createClient(db, callback) {
  const pool = new pg.Pool(db);
  pool.connect((err, client, done) => {
    if (err) {
      return callback(err);
    }
    return callback(null, pool);
  });
}

function postgreConnector(db, callback) {
  createClient(db, (err, pool) => {
    if (err) {
      logger.error(err);
      callback(err);
    } else {
      logger.debug(`connected to database:${db.uri}`);
      postgreSQLPool.set(db.uri, pool);
      callback(null, pool);
    }
  });
}


module.exports = postgreConnector;
