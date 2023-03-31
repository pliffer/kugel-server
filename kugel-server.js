
let config = require(process.env.ROOT + '/package.json').kugel.config;

// @todo Add more options
if(!config.socketio){

    require('./kugel-server-default.js');

} else{

    require('./kugel-server-socket.js');

}