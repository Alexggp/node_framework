
const middleware = require('./middleware');



exports.registerRoutes = function (router) {
	'use strict';
	router
		.route('/test')
		.get(middleware.get);
};