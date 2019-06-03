/*
 SKMO-api
 @goal: skmo scalable api-rest
 @author: Nacho Ariza 2017
 @ start single || cluster mode
 */
const fs = require('fs');
const util = require('util');
const cluster = require('cluster');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const helmet = require('helmet');
const generalRoutes = require('./routes/loadingRoutes');
const mongoTestLoader = require('./loader/mongoTest'); // mongodb db test connector
const mongoTest2Loader = require('./loader/mongoTest2'); // mongodb db test connector
const app = express();
const https = require('https');
const http = require('http');
const async = require('async');
const config = require('../config/config'); // config file
const logger = require('./logger/logger').logger(__filename);
const log4js = require('log4js');
const theAppLog = log4js.getLogger();
const middleware = require('./middleware/requestBody');
const theHTTPLog = morgan(':remote-addr - :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', {
	'stream': {
		write: function (str) {
			theAppLog.debug(str);
		}
	}
});
let started = false;

function start() {
	const key = fs.readFileSync('./cert/server.key'); // your server.key && pem files
	const cert = fs.readFileSync('./cert/server.pem')
	const https_options = {
		key: key,
		cert: cert
	};
	logger.info('Starting server, please wait...');
	app.use(helmet());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json({limit: '5mb'}));
	app.use(theHTTPLog);
	app.use(methodOverride());
	app.use('/', express.static('public')); // for public contents
	app.use(middleware.requestBodyParams);
	app.use(config.rest.path, generalRoutes.register());


	app.disable('x-powered-by');
	if (process.env.NODE_ENV != 'production') {
		https.createServer(https_options, app).listen(config.app.https).on('error', function (err) {
			if (err) {
				logger.error(err);
				process.exit(1);
			}
		});
		http.createServer(app).listen(config.app.http).on('error', function (err) {
			if (err) {
				logger.error(err);
				process.exit(1);
			}
		});
	}else{
		app.listen(config.app.https).on('error', function (err) {
			if (err) {
				logger.error(err);
				process.exit(1);
			}
		});
	}
//	_loaders = [mongoTestLoader.mongodbLoader,mongoTest2Loader.mongodbLoader];
	const _loaders = []; // no loaders...
	async.series(_loaders,
		function (err, result) {
			if (err) {
				logger.error(util.format('Something went wrong in booting time (%s)', err));
				process.exit(1);
			} else {
				logger.info('Server started at ports [' + config.app.http + ',' + config.app.https + ']');
				started = true;
			}
		});
}

function startInCluster() {
	if (!cluster.isMaster) {
		start();
	}
	else {
		const threads = require('os').cpus().length;
		while (threads--) cluster.fork();
		cluster.on('death', function (worker) {
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
