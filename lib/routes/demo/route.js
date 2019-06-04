const controller = require('./controller');



exports.registerRoutes = function (router) {

	router
		.route('/demo')
		.get(controller.get)
		.post(controller.post);
};