const fs = require('fs');
const util = require('util');
const cluster = require('cluster');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const http = require('http');
const https = require('https');
const async = require('async');
const log4js = require('log4js');
const os = require('os');

const generalRoutes = require('./routes/loading-routes');

// DB loaders

const mongoTestLoader = require('./loader/mongo-test'); // mongodb db test connector
// const mongoTest2Loader = require('./loader/mongo-test2'); // mongodb db test connector
const redisLoader = require('./loader/redis-loader');
const postgresqlLoader = require('./loader/postgresql-loader');
const mysqlLoader = require('./loader/mysql-loader');

const app = express();

const config = require('../config/config'); // config file
const customResponse = require('./middleware/custom-response');
const logger = require('./logger/logger').logger(__filename);


const theAppLog = log4js.getLogger();
const requestLog = require('./middleware/request-log');

const theHTTPLog = morgan(':remote-addr - :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', {
  stream: {
    write(str) {
      theAppLog.debug(str);
    },
  },
});

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'demo API', // Title (required)
      version: '1.0.0', // Version (required)
    },
    // securityDefinitions: {
    // 	jwt: {
    // 		description: 'The field value must be formed like: bearer -myToken-',
    // 		type: 'apiKey',
    // 		name: 'Authorization', // this is the header name that will be sent
    // 		in: 'header' // location of api key
    // 	}
    // },
    // security: [
    // 	{
    // 		jwt: []
    // 	}
    // ]
  },
  apis: ['./lib/routes/*/route.js', './lib/middleware/custom-response.js'], // Path to the API docs
};
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(swaggerOptions);

let started = false;

function start() {
  const key = fs.readFileSync('./cert/server.key'); // your server.key && pem files
  const cert = fs.readFileSync('./cert/server.pem');
  const httpsOptions = {
    key,
    cert,
  };
  logger.info('Starting server, please wait...');
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(theHTTPLog);
  app.use(methodOverride());
  app.use(customResponse);
  app.use(requestLog);
  app.use('/', express.static('public')); // for public contents


  if (process.env.NODE_ENV !== 'production') {
    app
      .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
      .get('/swagger.json', (req, res) => {
        res.json(swaggerSpec);
      });
  }

  app.use(config.rest.path, generalRoutes.register());


  app.disable('x-powered-by');
  if (process.env.NODE_ENV !== 'production') {
    https.createServer(httpsOptions, app).listen(config.app.https).on('error', (err) => {
      if (err) {
        logger.error(err);
        process.exit(1);
      }
    });
    http.createServer(app).listen(config.app.http).on('error', (err) => {
      if (err) {
        logger.error(err);
        process.exit(1);
      }
    });
  } else {
    app.listen(config.app.https).on('error', (err) => {
      if (err) {
        logger.error(err);
        process.exit(1);
      }
    });
  }
  //	loaders = [mongoTestLoader.mongodbLoader,mongoTest2Loader.mongodbLoader];
  const loaders = []; // no loaders...
  async.series(loaders,
    (err, result) => {
      if (err) {
        logger.error(util.format('Something went wrong in booting time (%s)', err));
        process.exit(1);
      } else {
        logger.info(`Server started at ports [${config.app.http},${config.app.https}]`);
        started = true;
      }
    });
}

function startInCluster() {
  if (!cluster.isMaster) {
    start();
  } else {
    let threads = os.cpus().length;
    while (threads--) cluster.fork();
    cluster.on('death', (worker) => {
      cluster.fork();
      logger.info('Process died and restarted, pid:', worker.pid);
    });
  }
}

function active() {
  return started;
}

function stop() {
  process.exit(0);
}

exports.start = start;
exports.startInCluster = startInCluster;
exports.active = active;
exports.stop = stop;
