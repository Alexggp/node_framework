const middleware = require('./middleware');



exports.registerRoutes = function (router) {

	router
		.route('/test')
		.get(middleware.get)
		.post(middleware.post);
};