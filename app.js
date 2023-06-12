const http = require('http');

http.createServer(function (req, res) {
	res.write('Server response! :)');
	res.end();
}
).listen(3000);

console.log("Server started on http://localhost:3000");
