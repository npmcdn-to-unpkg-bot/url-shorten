const Hapi = require('hapi');
const server = Hapi.Server();
const router = require('./router');
const mongoose = require('mongoose');
const mongoUri = process.env.MONGOURI || 'mongo://localhost/shortio';

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
