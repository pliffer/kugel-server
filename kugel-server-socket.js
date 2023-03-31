const express = require('express');
const http = require('http');
const morgan = require('morgan');
const socketIO = require('socket.io'); // Add this line

const Components = require('kugel-components');

const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';
const protocol = process.env.PROTOCOL || 'http';

let config = require(process.env.ROOT + '/package.json').kugel.config;

const app = express();

Components.on('express-middleware', middleware => {
  app.use(middleware);
});

Components.on('express-static', static => {
  app.use(express.static(static));
});

if (config.morgan) {
  app.use(morgan(config.morgan));
}

if (config.template_engine) {
  app.set('view engine', config.template_engine);

  Components.on('express-views', viewPath => {
    let views = app.get('views');

    if (typeof views == 'string') views = [views];

    views.push(viewPath);

    app.set('views', views);
  });
}

const server = http.createServer(app);
const io = socketIO(server); // Add this line

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => {
  Components.get('express-listen').add(app);

  console.log(`@info http and socket listening on ${protocol}://${host}:${port}`);
});
