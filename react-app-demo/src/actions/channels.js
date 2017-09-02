import * as types from "./types";
const WS = require('websocket').w3cwebsocket;

/*
 * Initialize a pub-sub channel
 */
export function initChannel() {
  return (dispatch, getState) => {
    var appId = 'app_1245'
    var commandChannel = new WS('ws://localhost:80/channel/command/pub/' + appId + '?access_token=' + getState().keycloak.token);
    var resultChannel = new WS('ws://localhost:80/channel/result/sub/' + appId + '?access_token=' + getState().keycloak.token);

    commandChannel.onerror = function() {
      console.log('Connection Error');

      dispatch({
        type: types.CHANNEL_ERROR
      });
    };

    commandChannel.onopen = function() {
      console.log('WebSocket Client Connected');
      dispatch({
        type: types.CHANNEL_SUCCESS
      });
    };

    commandChannel.onclose = function() {
      console.log('WebSocket Client Closed');
      dispatch({
        type: types.CHANNEL_CLOSED
      });
    };

    commandChannel.onmessage = function(e) {
      //console.log('Command channel received:', e);
    }

    resultChannel.onmessage = function(e) {
      console.log('Result channel received:', e);

      dispatch({
        type: types.RECEIVED_RESULT,
        result: e.data
      });
    }

    dispatch({
      type: types.INIT_CHANNEL,
      payload: {commandChannel: commandChannel, resultChannel: resultChannel}
    });
  }
}

export function sendCommand(command) {
  return (dispatch, getState) => {
    getState().channels.commandChannel.send(command);

    dispatch({
      type: types.SEND_COMMAND,
      command: command
    });
  }
}
