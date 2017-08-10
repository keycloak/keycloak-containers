import * as types from "./types";
const WS = require('websocket').w3cwebsocket;

/*
 * Initialize a pub-sub channel
 */
export function initChannel() {
  return (dispatch, getState) => {
    var appId = 'app_1245'
    var channel = new WS('ws://localhost:80/auth-pubsub/' + appId + '?access_token=' + getState().keycloak.token);

    channel.onerror = function() {
      console.log('Connection Error');

      dispatch({
        type: types.CHANNEL_ERROR
      });
    };

    channel.onopen = function() {
      console.log('WebSocket Client Connected');
      dispatch({
        type: types.CHANNEL_SUCCESS
      });
    };

    channel.onclose = function() {
      console.log('WebSocket Client Closed');
      dispatch({
        type: types.CHANNEL_CLOSED
      });
    };

    channel.onmessage = function(e) {
      console.log('got:', e);

      dispatch({
        type: types.RECEIVED_DATA,
        data: e.data
      });
    }

    dispatch({
      type: types.INIT_CHANNEL,
      channel: channel
    });
  }
}

export function sendCommand(command) {
  return (dispatch, getState) => {
    getState().channel.channel.send(command);

    dispatch({
      type: types.SEND_COMMAND,
      command: command
    });
  }
}
