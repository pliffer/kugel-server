const express  = require('express');
const morgan   = require('morgan');
const fs       = require('fs');
const path     = require('path');
const http     = require('http');
const socketIO = require('socket.io');
const kugel    = require('kugel');
const cors     = require('cors');
const fileUpload = require('express-fileupload');

const Component = kugel.Component;

const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';
const protocol = process.env.PROTOCOL || 'http';

let config = require(process.env.ROOT + '/package.json').kugel.config;

let main = (app, protocol, host, port) => {

    var server = http.createServer(app);

    server.listen(port, () => {
    
        Component.get('express-listen').add(app);
    
        console.log(`@info listening on ${protocol}://${host}:${port}`)
    
    });

	return {
		app: app
	}
    
}

if(config.socketio){

    main = (app, protocol, host, port) => {

		const server = http.createServer(app);
		const io     = socketIO(server);
	
		server.listen(port, () => {
	
			Component.get('express-listen').add(app);
			Component.get('socket-listen').add(io);
	
			console.log(`@info http and socket listening on ${protocol}://${host}:${port}`);
	
		});

		return {
			app: app,
			io: io
		}

	}

}

const app = express();

main(app, protocol, host, port);

if (config.morgan) {

    app.use(morgan(config.morgan));

}

if(config.template_engine){

    app.set('view engine', config.template_engine);
    
}

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

if(config.upload){

    console.log('Upload enabled');

    app.use(fileUpload());

}

if(config.body_parser){

    app.use(express.json({

        limit: process.env.BODYPARSER_LIMIT || '10mb'

    }));

    app.use(express.urlencoded({

        limit: process.env.BODYPARSER_LIMIT || '10mb',
        extended: true

    }));

}

if(config.cors){

    app.use(cors({
        origin: config.cors.origin || '*',
        methods: config.cors.methods || ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: config.cors.headers || ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: config.cors.credentials || true,
        optionsSuccessStatus: config.cors.optionStatus || 200,
        preflightContinue: config.cors.preflightContinue || false
    }));

}

module.exports = {

	static: {

		add: (folder, options) => {

			app.use(express.static(folder, options));

		}
		
	},
	
	middleware: {

		add: (middleware) => {

			app.use(middleware);

		}

	},

	views: {

		add: (viewPath) => {

			let views = app.get('views');

			if (typeof views == 'string') views = [views];

			views.push(viewPath);

			app.set('views', views);
			app.set('views', path);

		}
		
	}

}

module.exports.app = app;