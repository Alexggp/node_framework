/* list of all routes */
const router = require('express').Router();
const demoRoute = require('./demo/route');

function register(){
	demoRoute.registerRoutes(router);
	// add your routes here ,,,,
	return router;
}
module.exports.register = register;