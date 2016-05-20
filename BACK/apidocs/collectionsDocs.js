// Install : npm install  --save apidoc -g
// Update : apidoc -i apidocs/ -o apidocs/api



/**
 * @api {get} /collections/:id Get all Collections
 * @apiName GetAllCollections
 * @apiGroup Collections
 * @apiVersion 0.0.1
 *
 * @apiSuccess {String} name Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 * @apiSuccess {String} address Address of the User.
 * @apiSuccess {String} phone   Phone of the User.
 * @apiSuccess {String} email   email of the User.
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id" : "ObjectId(12345)",
 *       "name" : "xxx",
 *       "lastname":"xxx",
 *       "address":"xxx",
 *       "phone":"xxxxxxxxx",
 *       "email":"xxx"
 *     }
 *
 * @apiSuccessExample {json} Success-Response (304):
 *     HTTP/1.1 304 Not Modified
 *
 * @apiSampleRequest http://localhost:3000/api/users/
 *
 * @apiError (Error 5xx) 500 Internal Server Error
 *
 */

/**
 * @api {get} /collections/:id Get all Collections
 * @apiName GetAllCollections
 * @apiGroup Collections
 * @apiVersion 0.0.1
 *
 * @apiSuccess {String} name Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 * @apiSuccess {String} address Address of the User.
 * @apiSuccess {String} phone   Phone of the User.
 * @apiSuccess {String} email   email of the User.
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id" : "ObjectId(12345)",
 *       "name" : "xxx",
 *       "lastname":"xxx",
 *       "address":"xxx",
 *       "phone":"xxxxxxxxx",
 *       "email":"xxx"
 *     }
 *
 * @apiSuccessExample {json} Success-Response (304):
 *     HTTP/1.1 304 Not Modified
 *
 * @apiSampleRequest http://localhost:3000/api/users/
 *
 * @apiError (Error 5xx) 500 Internal Server Error
 *
 */