let config = require(process.env.ROOT + '/package.json').kugel.config;

if(config.socketio){

    require('./kugel-server-socket.js');

} else{

    require('./kugel-server-default.js');

}
