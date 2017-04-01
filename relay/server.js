'use strict';
require('./bootstrap');

const uuid = require('uuid/v4');

const express = require('express');
const boostrapAPI = require('./backend/src/api');
const bootstrapSocketIO = require('./backend/src/sockets/socketio');
const bootstrapModels = require('./backend/src/models');
const PORT = process.env.PORT || 8080;

const pg = require('pg');
const config = require('./backend/src/config');

require('./backend/src/pgclient')(config, (err, pgPool) => {
  if(err){
    throw err;
  }

  const models = bootstrapModels(pgPool, config);

  const app = express();
  const server = require('http').createServer(app);

  // launch socketio
  const {clients, consoles} = bootstrapSocketIO(server, models);

  // launch api
  boostrapAPI(app, models, clients);

  // launch client serving
  app.get('/client.js', express.static('tag/build'));
  app.use(express.static('frontend/build')); // launch static server

  server.listen(PORT);
  console.log('Listening on %s', PORT);

});
