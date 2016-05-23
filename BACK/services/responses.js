
exports.successOK = function (res, msg = "Successful operation" ){
    res.status(200);
    res.send({'msg': '200 OK - ' + msg});
}

exports.successCreated = function (res, msg = "" ){
    res.status(200);
    res.send({'msg': '201 Created - ' + msg});
}

exports.errorRequestNotAcceptable = function(res, msg = "Invalid request format" ){
    res.status(406);
    res.send({'msg': '406 Not Acceptable - ' + msg});
}

exports.errorBadRequest = function(res, msg = "Invalid ID") {
    res.status(400);
    res.send({'msg': '400 Bad request - ' + msg});
}

exports.errorNotFound = function(res, msg = "Collection not found") {
    res.status(404);
    res.send({'msg': '404 Not Found - ' + msg});
}

exports.errorInternalServer = function(res, err) {
    res.status(500);
    res.send({'msg': '404 Internal Server Error'});
    console.log(err);
}

exports.errorPreconFailed = function(res, msg = "Original item are the same as updated items") {
    res.status(412);
    res.send({'msg': '412 Precondition Failed - ' + msg});
}

