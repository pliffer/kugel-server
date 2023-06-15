const http    = require('http')
const kugel   = require('kugel');

const Component = kugel.Component;

module.exports = (app, protocol, host, port) => {

    var server = http.createServer(app);

    server.listen(port, () => {
    
        Component.get('express-listen').add(app);
    
        console.log(`@info listening on ${protocol}://${host}:${port}`)
    
    });
    
}
