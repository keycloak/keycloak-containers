'use strict';

if(typeof killbugtodaySettings !== 'object' || typeof killbugtodaySettings.app_id !== 'string'){
  throw new Error('`killbugtodaySettings` must be a global object and contain an `app_id` property with a string value.');
}

//const {wrap, Serializer} = require('../../relay/src/sockets/wrap');
//const io = require('socket.io-client');

var WS = require('websocket').w3cwebsocket;

// Note: No auth on tag (cannot authenticate users from our clients)
// 2nd note: route not definitive
var client = new WS('ws://' + process.env.ENDPOINT + '/pubsub/' + killbugtodaySettings.app_id); // from Nchan we can extract this route param with $1

//const socket = io(process.env.ENDPOINT+'/client', {});

client.onerror = function() {
  console.log('Connection Error');
};

client.onopen = function() {
  //To send msg => client.send(msg)

  console.log('WebSocket Client Connected');
};

client.onclose = function() {
  console.log('WebSocket Client Closed');
};

client.onmessage = function(e) {
  // @todo Check type message (execute, etc.)

  f = wrap(f);
  try {
    const res = eval(cmd);
    // console.log(cmd, " => (",typeof res, ") ", Serializer.toPrimitive(res));
    // console.debug(Serializer.toPrimitive(res));
    f(null, res);
  } catch (err) {
    console.error('GOT ERROR', err);
    f(err);
  }
};

// Plugins
//const Errors = require('./plugins/Errors/Errors')(socket);
//require('./plugins/DOM')(socket);

// @todo ensure APP_ID & USER_IDENTITY (string) & CUSTOM_DATA (optional) are defined

// @todo send at authentication level
/*
socket.on('handshake', function(f) {
  f(null, {
    app_id: killbugtodaySettings.app_id,
    context: killbugtodaySettings.context
  });
});
*/

/*
socket.on('forwarding', () => {
  // console.log('forwarding');
  // DOM.stop();
  // DOM.start();
});

socket.on('forwarding:stopped', () => {
  // DOM.stop();
});

socket.on('execute', function(cmd, f) {
  f = wrap(f);

  try {
    const res = eval(cmd);
    // console.log(cmd, " => (",typeof res, ") ", Serializer.toPrimitive(res));
    // console.debug(Serializer.toPrimitive(res));
    f(null, res);
  } catch (err) {
    console.error('GOT ERROR', err);
    f(err);
  }
});
*/
