'use strict';

const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createHash = require('./createHash');
const hashLen = 8;

const baseUrl = process.env.BASE_URL || 'http://localhost:3000/';
const urlPattern = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

//Mongo schema
const redirSchema = new Schema({
  shortUrl: String,
  url: String,
  created_at: Date
});

const Redir = mongoose.model('Redir', redirSchema);

//Handling routing

module.exports = [{
  method: 'GET',
  path: '/{hash}',
  handler(request, reply) {
    const query = {
      'shortUrl': '${baseUrl}/${request.params.hash}'
    };
    Redir.findOne(query, (err, redir) => {
      if (err) {
        return reply(err);
      } else if (redir) {
        reply().redirect(redir.url);
      } else {
        reply.fil('views/404').code(404);
      }
    });
  }
}, {
  method: 'POST',
  path: '/new',
  handler(request, reply) {
    const uniqueID = createHash(hashLen);
    const newRedir = new Redir({
      shortUrl: '${baseUrl}/${uniqueID}',
      url: request.payload.url,
      create_at: new Date()
    });

    newRedir.save((err, redir) => {
      if (err) {
        reply(err);
      } else {
        reply(redir);
      }
    });
  },
  config: {
    validate: {
      payload: {
        url: Joi.string().regex(urlPattern).required()
      }
    }
  }
}, {
  method: 'GET',
  path: '/',
  handler(request, reply) {
    reply.file('view/index');
  }
}, {
  method: 'GET',
  path: '/public/{file}',
  handler(request, reply) {
    reply.file('public/' + request.params.file);
  }
}]

