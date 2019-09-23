Components
-------------

Each component folder corresponds to a route exposed in the application and contains
the necessary elements to perform its part of the flow and respond to the request.

- Route
- Schema
- Controller

### Route
Here the methods for the routes and sub-routes of the component are registered and each one is assigned a controller.

The suagger for this component is also defined in this file.

### Schema
Input definitions to be validated for each route in the component.

### Controller

- This file contains every endpoint controller.

- Those controllers export arrays of middlewares. Middlewares are (res,req,next) => {} functions.
  <https://expressjs.com/en/guide/using-middleware.html>

- Data pass from a middleware to another in res.locals object.

- If the end point has params you should call setInput and validateSchema methods

- You can add as many middlewares to the controller as needed. The last one should have not next() argument and should make the response of the end point call.
(*res.customResponse.success(result)* or *res.send(result)*)

- If one controller is too large or complex, you can locate it in another file just alone.

- You also can pass the middlewares array, or just one middleware, to the constructor directly, as you can see in get Controller example. Controller "insertMiddleware" method works the same way, as you can see in port Controller example.
