var packetHandler = require("./packet.js");
var net = require('net');
var port = 11012;

var clients = [];

/** Create the TCP server and register callbacks */
var server = net.createServer(function(socket) {
	socket.name = socket.remoteAddress + ":" + socket.remotePort;
	console.log("Client: " + socket.remoteAddress + " connected.");
	clients.push(socket);

	socket.on('data', function(data) {
		var packet = data.toString().split("%");
		
		if(packet != null) {
			var result = packetHandler.handle(packet);
			socket.write(result);
		}
	});

	socket.on('end', function() {
		clients.splice(clients.indexOf(socket), 1);
	});
});

server.listen(port, '0.0.0.0');

console.log("Server running on port: "+port);
