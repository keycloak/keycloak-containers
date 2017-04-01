'use strict';
const getConnectedTime = flow(get('handshake.time'), (dateAsStr) => new Date(dateAsStr).toISOString());
const getContext = get('_state_.context');
const getApplicationId = get('_state_.app_id');
const getUserId = get('_state_.context.$user_id');

module.exports = (io, {
  Serializer,
  wrap
}, models) => {
  assert(_.isObject(io));

  const {attachContext} = require('./clients.Context')(models, executeOnSocket);

  // Clients
  const clients = io.of('/client');

  // http://stackoverflow.com/a/33960032/745121
  function addCatchAllEvent(socket) {
    var onevent = socket.onevent;
    socket.onevent = function(packet) {
      var args = packet.data || [];
      onevent.call(this, packet); // original call
      packet.data = ["*"].concat(args);
      onevent.call(this, packet); // additional call to catch-all
    };
  }

  clients.on('connection', function(socket) {
    console.log(socket.id, 'client connection');
    socket.forwarderListeners = []; // will contains an array of console listeners

    addCatchAllEvent(socket);

    socket._state_ = {
      app_id: null, // when app is is not defined, the socket has not handhsaken
      context: null
    };

    socket.on('disconnect', () => {
      // do some cleaning
      let i = socket.forwarderListeners.length;
      while (i--) {
        let consoleListener = socket.forwarderListeners.pop();
        socket.removeListener('*', consoleListener);
      }
    });

    socket.emit('handshake', function callback(err, {app_id, context:tagContext}) {
      if (err) {
        console.error(err);
        return;
      }


      // (model) save session
      const tuple = {
        session_id: socket.id,
        application_id: app_id,
        user_id: get('$user_id', tagContext) || null // special reserved tag keyword
      };
      models.Sessions.insert(tuple, (err) => {
        if (err) {
          // the app may not exist
          // so don't attach this socket
          console.error('models.Sessions.insert(%s, %s, %s) FAILED %s\nDisconnecting the socket.', tuple.session_id, tuple.application_id, tuple.user_id, err.message);
          console.error(err.stack);
          try {
            socket.disconnect();
          } catch (err) {
            console.error('Could not disconnect', err.message, err.stack);
          }
          return;
        }

        socket._state_.app_id = app_id;

        attachContext(socket, app_id, tagContext);
      });

    });
  });


  const STOP_LISTENING = '_STOP_LISTEN_'; // hidden event to stop listening

  // when a console socket wants to listen to every events of a session_id
  // @todo (bug @fixme ) what if two admin a listening on the same session?
  function tryForwardingSessionToSocket(consoleSocket, application_id, session_id, f) {
    if (!application_id) {
      return f(new Error('application_id must be defined'));
    }

    // find client socket
    let clientSocket = findSocket(session_id, application_id);
    if (!clientSocket) {
      return f(new Error('session socket not found'));
    }

    console.log('%s LISTENING ON %s', consoleSocket.id, clientSocket.id);

    function listener(event, session_to_stop_listening/* ...args */) {
      if (consoleSocket.disconnected || (event === STOP_LISTENING && session_to_stop_listening === session_id)) {
        console.log('%s STOP LISTENING ON %s', consoleSocket.id, clientSocket.id);
        clientSocket.removeListener('*', listener);
        clientSocket = null;
        consoleSocket = null;
        return;
      }

      consoleSocket.emit.apply(consoleSocket, arguments); // forward
    }

    clientSocket.on('*', listener); // listen

    listener.id = consoleSocket.id;
    clientSocket.forwarderListeners.push(listener); // add it to the listeners (for futur call bypassing socket.io eventemitters)

    if (clientSocket.forwarderListeners.length === 1) {
      // inform the client that someone wants to see what is going on
      clientSocket.emit('forwarding');
    }

    console.log('clientSocket.forwarderListeners.length', clientSocket.forwarderListeners.length);

    f(null, clientSocket);
  }

  function stopForwardingSessionToSocket(consoleSocket, application_id, session_id) {
    if (!consoleSocket || !application_id || !session_id) {
      return;
    }

    const clientSocket = findSocket(session_id, application_id);
    if (!clientSocket) {
      console.error('clientSocket not found', session_id, application_id);
      // not found
      return;
    }

    const listener = _.find(clientSocket.forwarderListeners, {id: consoleSocket.id});

    if (!listener) {
      console.error('listener not found', {
        id: consoleSocket.id
      }, clientSocket.forwarderListeners);
      // weird
      return;
    }

    listener(STOP_LISTENING, session_id); // auto remove it HAHA
    _.remove(clientSocket.forwarderListeners, {id: consoleSocket.id});

    if (clientSocket.forwarderListeners.length === 0) {
      // inform the client that noone is watching
      clientSocket.emit('forwarding:stopped');
    }
  }

  //
  // Public API
  //
  //
  function findSocket(session_id, application_id) {
    return _.find(clients.sockets, (socket, socketId) => socket.id === session_id && getApplicationId(socket) === application_id);
  }

  // @fixme temporary
  function _sendToClient(session_id, application_id, evt, obj){
    let clientSocket = findSocket(session_id, application_id);
    if(!clientSocket){
      return;
    }

    clientSocket.emit(evt, obj);
  }

  /**
   * Execute a command on socket
   * @param  {Socket.io socket} socket
   * @param  {String} cmd            command to executeOnSocket
   * @param  {Number} [timeout=5000]
   */
  function executeOnSocket(socket, cmd, timeout = 15000){
    return Promise.fromCallback(f => socket.emit('execute', cmd, f)).timeout(timeout);
  }

  /**
   * Run a command against a client
   * @param  {String} session_id (a-k-a socketId)
   * @param  {String} cmd        command to execute
   * @param  {Function} f(err, result)
   */
  function execute(app_id, session_id, cmd, f) {
    // SECURITY: select the socket from BOTH it's app_id and session_id.
    //           Because the authorization was verified against the app_id earlier.

    const socket = findSocket(session_id, app_id);

    // debug mode only, take the first available socket
    // session_id = Object.keys(clients.sockets)[0] || session_id;
    // \debug
    if (!socket) {
      console.log('could not find socket ' + session_id);
      return wrap(f)(new Error('Could not find socket ' + session_id));
    }

    // @todo limit in space and time
    // @todo add timeout
    executeOnSocket(socket, cmd).then(result => {
      console.log(cmd, ' => (', null, '(', typeof null, '), ', result, '(', typeof result, '))');
      f(null, result);
    }).catch(err => {
      console.log(cmd, ' => (', err, '(', typeof err, '), ', null, '(', typeof null, '))');
      f(err);
    })
  }

  // socket => JSON object (to be viewed publicly)
  const viewForSocket = (socket) => {
    return _.extend({
      session_id: socket.id,
      application_id: getApplicationId(socket),
      connectedAt: getConnectedTime(socket),
      context: getContext(socket)
    });
  };

  // Yield client socket that match the applicationId
  // String(applicationId) => Array[Object(socket)]
  const socketsForApplicationId = (applicationId) => filter((socket, socketId) => getApplicationId(socket) === applicationId, clients.sockets);

  // Take an array of applications id and yield an array of publicly serializable objects
  // Array[UUID] => Array[Object]
  const socketsForApplicationIds = flow(flatMap(socketsForApplicationId), map(viewForSocket));

  // (applicationId) -> Array[UserId]
  const userIdsForApplicationId = flow(flatMap(socketsForApplicationId), map(viewForSocket));

  return {clients, socketsForApplicationIds, userIdsForApplicationId, execute, tryForwardingSessionToSocket, stopForwardingSessionToSocket, _sendToClient};
}
