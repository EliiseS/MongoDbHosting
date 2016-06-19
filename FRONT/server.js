var connect = require('connect'),
serveStatic = require('serve-static');

var app = connect();

app.use(serveStatic("./"));// By default returns index file
app.listen(5000);
console.log("Server is listening on port 5000:");