const http       = require('http');
const socketIO   = require('socket.io');
const kugel      = require('kugel');

const Component = kugel.Component;

module.exports = (app, protocol, host, port) {

	const server = http.createServer(app);
	const io     = socketIO(server);

	server.listen(port, () => {

		Component.get('express-listen').add(app);
		Component.get('socket-listen').add(io);

		console.log(`@info http and socket listening on ${protocol}://${host}:${port}`);

	});
	
}