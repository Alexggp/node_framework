const middleware = require('./middleware');



exports.registerRoutes = function (router) {

	router
		.route('/demo')
		.get(middleware.get)
		.post(middleware.post);
};