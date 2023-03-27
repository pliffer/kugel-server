const express = require('express')
const http    = require('http')
const morgan  = require('morgan');

const Components = require('kugel-components');

const port     = process.env.PORT     || 8080
const host     = process.env.HOST     || 'localhost'
const protocol = process.env.PROTOCOL || 'http'

let config = require(process.env.ROOT + '/package.json').kugel.config;

const app = express();

Components.on('express-middleware', middleware => {

    app.use(middleware);

});

Components.on('express-static', static => {

    app.use(express.static(static));

});

if(config.morgan){

    app.use(morgan(config.morgan));

}

if(config.template_engine){

    app.set('view engine', config.template_engine);

    Components.on('express-views', viewPath => {

        let views = app.get('views');

        if(typeof views == 'string') views = [views];

        views.push(viewPath);

        app.set('views', views);
    
    });
    
}

var server = http.createServer(app);

server.listen(port, () => {

    Components.get('express-listen').add(app);

    console.log(`@info listening on ${protocol}://${host}:${port}`)

});
