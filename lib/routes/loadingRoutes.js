/* list of all routes */
const router = require('express').Router();
const testRoute = require('./test/route');

function register(){
	testRoute.registerRoutes(router);
	// add your routes here ,,,,
	return router;
}
module.exports.register = register;