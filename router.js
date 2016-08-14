'use strict';

const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createHash = require('./createHash');
const hashLen = 8;

const baseUrl = process.env.BASE_URL || 'http://my-domain.com';
const urlPattern = /^https|http?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

//Mongo schema
const redirSchema = new Schema({
  shortUrl: String,
  url: String,
  created_at: Date
});

const Redir = mongoose.model('Redir', redirSchema);

//console.log(Redir);
//Handling routing

module.exports = [{
  method: 'GET',
  path: '/{hash}',
  handler(request, reply) {
    const query = {
      'shortUrl': `${baseUrl}/${request.params.hash}`
    };
    Redir.findOne(query, (err, redir) => {
      if (err) {
        return reply(err);
      } else if (redir) {
        reply().redirect(redir.url);
      } else {
        reply.view('404').code(404);
      }
    });
  }
}, {
  method: 'POST',
  path: '/new',
  config: {
    handler(request, reply) {
      const uniqueID = createHash(hashLen);
      const newRedir = new Redir({
        shortUrl: `${baseUrl}/${uniqueID}`,
        url: request.payload.url,
        createdAt: new Date()
      });
      newRedir.save((err, redir) => {
        if (err) {
          reply(err);
        } else {
          reply(redir);
        }
      });
    },
    validate: {
      payload: {
        //url: 'http://mashable.com/2016/08/13/lesbian-gay-bisexual-high-school-violence-study/#H358xzYxNEqz'
        url: Joi.string().regex(urlPattern).required()
      }
    }
  }
}, {
  method: 'GET',
  path: '/',
  handler(request, reply) {
    console.log('Rendering index page');
    reply.view('index');
  }
}, {
  method: 'GET',
  path: '/css/{file}',
  handler(request, reply) {
    reply.file('public/css/' + request.params.file);
  }
}, {
  method: 'GET',
  path: '/js/{file}',
  handler(request, reply) {
    reply.file('public/js/' + request.params.file);
  }
}, {
  method: 'GET',
  path: '/favicon.ico',
  handler(request, reply) {
    return reply.file('public/images/favicon.ico');
  },
  config: {
    auth: false
  }
}];

