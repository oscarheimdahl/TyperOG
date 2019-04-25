$(function() {
	console.log('hej');
	var socket = io();
	$('#send').click(function(e) {
		console.log(123);
		e.preventDefault(); // prevents page reloading
		socket.emit('chat message', $('#m').val());
		$('#messages').append($('<li class="ownmsg">').text($('#m').val()));
		$('#m').val('');
		return false;
	});
	$('.important').click(function(e) {
		e.preventDefault(); // prevents page reloading
		socket.emit('important', $('#m').val());
		$('#messages').append($('<li class="importantmsg">').text($('#m').val()));
		$('#m').val('');
		return false;
	});
	socket.on('chat message', function(msg) {
		$('#messages').append($('<li>').text(msg));
	});
});
