/*
	Here services are designed as independent code pieces to be used in different controllers 
	and as many times as necessary.
  They perform asynchronous transactions such as database calls or external APIs calls.
*/

const logger = require('../../logger/logger').logger(__filename);
const config = require('../../../config/config');
const serviceName = 'Demo';

function worker(inputData, callback){
	//Write your asyncrhonous code here
	const response = `Demo service says: ${data.message}`;
	callback(null,response);
}

function entry(inputData, callback){
	logger.debug(`${serviceName} service called`);
	worker(inputData, function(err, result){
		if (err) logger.error(`${serviceName} service error: ${JSON.parse(err)}`);
		else logger.debug(`${serviceName} service successfuly completed`);
		callback(err, result);
	})
}

module.exports.entry = entry;

