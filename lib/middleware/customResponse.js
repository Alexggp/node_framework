const httpCodes = require('./../utils/httpCodes');

module.exports = (req, res, next) => {
  const sendResponse = (code, desc) => {
    res.status(code).send({
      code: code || 'Unknown',
      message: httpCodes[code] || 'Unknown',
      response: desc || 'Unknown',
    });
  };

  /**
   * Code ref => https://httpstatuses.com/
   */
  res.customResponse = {
    generic: (code, desc) => sendResponse(code, desc),
    success: desc => sendResponse(200, desc),
    created: desc => sendResponse(201, desc),
    badRequest: desc => sendResponse(400, desc),
    unauthorized: desc => sendResponse(401, desc),
    forbidden: desc => sendResponse(403, desc),
    conflict: desc => sendResponse(409, desc),
    failedDependency: desc => sendResponse(424, desc),
    internalServerError: desc => sendResponse(500, desc),
  };

  next();
};
