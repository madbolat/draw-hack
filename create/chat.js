
$(function(){
   	//make connection
	var socket = io.connect('http://10.4.2.102:3000')

	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")

	//Emit message
	send_message.click(function(){
		socket.emit('new_message', {message : message.val()})
	})

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		var cdate = new Date();
	 	var time = cdate.getHours() + ":" + cdate.getMinutes() + ":" + cdate.getSeconds();
		chatroom.append("<div class='mess list-group-item list-group-item-action'><b><i class='far fa-fw fa-user'></i>" + data.username + "</b> "+time+"<br> " + data.message + "</div>")
	})

	//Emit a username
	send_username.click(function(){
		socket.emit('change_username', {username : username.val()})
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p class='text-muted px-2 font-italic'><i class='fas fa-pen'></i><b>" + data.username + "</b> печатает..." + "</p>")
	})
});


