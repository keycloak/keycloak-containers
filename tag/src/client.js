'use strict';

if(typeof killbugtodaySettings !== 'object' || typeof killbugtodaySettings.app_id !== 'string'){
  throw new Error('`killbugtodaySettings` must be a global object and contain an `app_id` property with a string value.');
}

//const {wrap, Serializer} = require('../../relay/src/sockets/wrap');
//const io = require('socket.io-client');

var WS = require('websocket').w3cwebsocket;

// Note: No auth on tag (cannot authenticate users from our clients)
// 2nd note: route not definitive
var client = new WS('ws://' + process.env.ENDPOINT + '/channel/command/sub/' + killbugtodaySettings.app_id);
var resultChannel = new WS('ws://' + process.env.ENDPOINT + '/channel/result/pub/' + killbugtodaySettings.app_id);

//const socket = io(process.env.ENDPOINT+'/client', {});

client.onerror = function() {
  console.log('Command sub channel Connection Error');
};

client.onopen = function() {
  //To send msg => client.send(msg)

  console.log('Command sub channel  Connected');
};

client.onclose = function() {
  console.log('Command sub channel  Closed');
};

client.onmessage = function(e) {
  console.log('Command sub channel Received command', e);

  var result = eval(e.data);
  resultChannel.send(JSON.stringify(result));

  /*f = wrap(f);
  try {
    const res = eval(cmd);
    // console.log(cmd, " => (",typeof res, ") ", Serializer.toPrimitive(res));
    // console.debug(Serializer.toPrimitive(res));
    f(null, res);
  } catch (err) {
    console.error('GOT ERROR', err);
    f(err);
  }*/
};

resultChannel.onerror = function() {
  console.log('Result pub channel Connection Error');
};

resultChannel.onopen = function() {
  console.log('Result pub channel  Connected');
};

resultChannel.onclose = function() {
  console.log('Result pub channel  Closed');
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
