const redisLink0 = require('redis');
const logger = require('../logger/logger').logger(__filename);
const redisPool = require('./pool');


function CreateClient(redis, host, port, attempt) {
  return redis.createClient({
    host,
    port,
    retry_strategy(options) {
      logger.info(JSON.stringify(options));
      if (!options.error) {
        try {
          if (options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with a individual error
            logger.error(`redis error:${options.error.code}`);
            return new Error('The server refused the connection');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted');
          }
          if (options.times_connected > 10) {
            // End reconnecting with built in error
            return undefined;
          }
        } catch (err) {
          logger.error(err);
        }
      }
      // reconnect after
      if (options.attempt > attempt) {
        return null;
      }
      return Math.max(options.attempt * 300, 3000);
    },
  });
}

function redisConnector(config, callback) {
  const storeDB = new CreateClient(redisLink0, config.host, config.port, config.attempt);
  storeDB.select(config.database, (err, res) => {
    if (err) {
      logger.error(`redis error set db0:${err}`);
      callback(err);
    } else {
      logger.debug(`redis database:${config.database} set:${res}`);
      const uri = `${config.host}:${config.port}:${config.database}`;
      redisPool.set(uri, storeDB);
      callback(null, storeDB);
    }
  });
  storeDB.on('error', (err) => {
    logger.error(`redis DB0 error: ${err}`);
    const uri = `${config.host}:${config.host}:${config.database}`;
    redisPool.remove(uri, storeDB);
    callback(err);
  });
  storeDB.on('connect', () => {
    logger.debug(`connected to redis database:${storeDB.address}`);
  });
}


module.exports = redisConnector;
