const express    = require('express');
const http       = require('http');
const morgan     = require('morgan');
const socketIO   = require('socket.io');
const kugel      = require('kugel');

const Component = kugel.Component;

const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';
const protocol = process.env.PROTOCOL || 'http';

let config = require(process.env.ROOT + '/package.json').kugel.config;

const app = express();

Component.on('express-middleware', middleware => {
  // console.log('Middleware', middleware);
  app.use(middleware);
});

Component.on('express-static', static => {

  // console.log('Static', static);
  app.use(express.static(static));
});

if (config.morgan) {
  app.use(morgan(config.morgan));
}

if (config.template_engine) {
  app.set('view engine', config.template_engine);

  Component.on('express-views', viewPath => {

    // console.log(viewPath);

    let views = app.get('views');

    if (typeof views == 'string') views = [views];

    views.push(viewPath);

    app.set('views', views);
  });
}

const server = http.createServer(app);
const io     = socketIO(server);

// io.on('connection', (socket) => {

//   console.log('A user connected');

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });

// });

server.listen(port, () => {

    Component.get('express-listen').add(app);
    Component.get('socket-listen').add(io);

    console.log(`@info http and socket listening on ${protocol}://${host}:${port}`);

});
