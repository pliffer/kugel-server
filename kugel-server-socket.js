const express    = require('express');
const http       = require('http');
const morgan     = require('morgan');
const socketIO   = require('socket.io');
const kugel      = require('kugel');
const fs         = require('fs');

const Component = kugel.Component;

const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';
const protocol = process.env.PROTOCOL || 'http';

let config = require(process.env.ROOT + '/package.json').kugel.config;

const app = express();

Component.on('express-middleware', middleware => {
    app.use(middleware);
});

Component.on('express-static', static => {
    app.use(express.static(static));
});

if(config.logs?.ips){

  app.use((req, res, next) => {

      let ips = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      if(ips) ips = ips.split(', ');

      let ip = ips[0];

      if(ip == '::1') ip = 'localhost';
      if(ip == '::ffff:127.0.0.1') ip = 'localhost';

      let route = req.originalUrl;

      let logPath = process.cwd() + '/logs/404/' + ip + '/' + new Date().getFullYear() + '/' + new Date().getMonth();

      if(!fs.existsSync(logPath)){

          fs.mkdirSync(logPath, { recursive: true });

      }

      let logFile = logPath + '/' + new Date().getDate() + '.txt';

      let log = '';

      if(fs.existsSync(logFile)){

          log = fs.readFileSync(logFile, 'utf-8');

      }

      log += `${new Date().toLocaleString()} - ${route}\n`;

      fs.writeFileSync(logFile, log);

      next();

  });

}

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
