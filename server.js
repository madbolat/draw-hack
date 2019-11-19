var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
	var host = server.address().address;
	var port = server.address().port;
}

app.use(express.static('create'));

// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
	// We are given a websocket object in our function
	function (socket) {
		console.log("We have a new client: " + socket.id);

		//ЧАТ
		socket.username = "Анон"
		//listen on change_username
		socket.on('change_username', (data) => {
			socket.username = data.username
		})

		//listen on new_message
		socket.on('new_message', (data) => {
			//broadcast the new message
			io.sockets.emit('new_message', {message : data.message, username : socket.username});
		})

		//listen on typing
		socket.on('typing', (data) => {
			socket.broadcast.emit('typing', {username : socket.username})
		})
		//ЧАТ

		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('mouse',
			function(data) {
				console.log("Received: 'mouse' " + data.x + " " + data.y);
				// Send it to all other clients
				socket.broadcast.emit('mouse', data);
			}
		);
		//Очистка канваса
		socket.on('clearCanvas',
			function(data) {
				socket.broadcast.emit('clearCanvas', data);
			}
		);
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected");
		});
	}
);