'use strict';

const Hapi = require('hapi');
const Path = require('path');
const server = new Hapi.Server(); //Initiate hapi server, MUST use new()!!!
const router = require('./router');
const mongoose = require('mongoose');
const mongoUri = process.env.MONGOURI || 'mongodb://localhost/shortio';

//Monogo connection options
const options = {
  server: {
    socketOptions: { keepAlive: 30000, connectTimeoutMS: 30000}
  },
  replset: {
    socketOptions: { keepAlive: 30000, connectTimeoutMS: 30000}
  }
};

mongoose.connect(mongoUri, options);
const db = mongoose.connection;

/************************************************************/
//Hapi server initialize
server.connection({
  port: process.env.PORT || 3000,
  routes: {
    cors: true
  }
});

server.register(require('vision'), (err) => {
  server.views({
    engines: {
      dust: require('hapi-dust')
    },
    relativeTo: Path.join(__dirname),
    path: 'views/'
    // partialsPath: 'path/to/partials',
    // helpersPath: 'path/to/helpers',
  });

  db.on('error', console.error.bind(console, 'connection error:'))
    .once('open', () => {
      server.route(router);
      server.start(err => {
        if (err) {
          throw err;
        }
        console.log(`Server is running at port ${server.info.port}`);
      });
    });
});
