const controller = require('./controller');


exports.registerRoutes = function (router) {
  router
    .route('/demo')
    .get(controller.get)
    .post(controller.post);
};


// This swagger object defines the input and output for this endPoint
/**
  *
  * @swagger
  * definitions:
  *   DemoInput:
  *     type: "object"
  *     required:
  *       - message
  *     properties:
  *       message:
  *         type: string
  *
  * /api/demo:
  *   get:
  *     tags:
  *       - demo
  *     summary: demo GET endpoint
  *     description: It shows how to create a get method in a route and how it works
  *     responses:
  *       200:
  *         description: Ok
  *       500:
  *         description: Server error
  *
  *   post:
  *     tags:
  *       - demo
  *     summary: demo POST endpoint
  *     description: It shows how to create a post method in a route and how it works
  *     consumes: []
  *     produces:
  *       - application/json
  *     parameters:
  *     - in: "body"
  *       name: "message"
  *       description: demo input message
  *       required: true
  *       schema:
  *         $ref: "#/definitions/DemoInput"
  *     responses:
  *       200:
  *         description: Ok
  *       400:
  *         description: Bad request
  *       500:
  *         description: Server error
  */
