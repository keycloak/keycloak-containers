const fs = require('fs');

module.exports = ({
  clients,
  execute,
  tryForwardingSessionToSocket,
  _sendToClient,
  stopForwardingSessionToSocket
}, io, models, {Serializer, wrap}) => {
  assert(_.isObject(clients));
  assert(_.isFunction(execute));
  assert(_.isObject(io));
  assert(_.isObject(models));

  const consoles = io.of('/console');

  consoles.on('connection', function(socket) {
    console.log(socket.id, 'console connection');
    let isAuthenticated = false;
    socket._state_ = {
      SELECTED: null
    };

    function disconnect() {
      console.log('Disconnecting socket %s', socket.id);
      socket.emit('authentication:failed');
      socket.disconnect();
    }

    const authTimeout = setTimeout(disconnect, 10000); // after 10sec, if the socket is not authenticated, disconnect it

    /**
     * f(err : Null|Error, isAuthenticated: Boolean)
     */
    socket.on('authentication', ({
      jwt
    }, f) => {
      if (!_.isFunction(f)) {
        disconnect();
        return;
      }

      if (!jwt) {
        disconnect();
        return;
      }

      // check jwt
      models.Users.verifyJWT(jwt, (err, decoded) => {
        if (err) {
          disconnect();
          return;
        }

        if (!decoded || !decoded.sub) {
          disconnect();
          return;
        }

        // check it exists in database

        models.Users.findById(models.Users.extractUserIdFromJWTSub(decoded.sub), (err, user) => {
          if (err || !user) {
            console.error('models.Users.findById(%s)', decoded.sub, err, user)
            disconnect();
            return;
          }

          clearTimeout(authTimeout);
          isAuthenticated = true;
          f(null, decoded);
        });
      });
    });

    /*
    When the console admin want to change what session to listen to
     */
    socket.on('session:change', (session_id, application_id, f) => {
      if (!_.isFunction(f)) {
        return;
      }

      if (!isAuthenticated) { // @todo not dry refactor this
        return wrap(f)(new Error('Unauthenticated'));
      }

      //
      // @TODO SECURITY check that the user has access to the session_id !
      //

      // @todo use namespace for that
      if (socket._state_.SELECTED) {
        stopForwardingSessionToSocket(socket, socket._state_.SELECTED.application_id, socket._state_.SELECTED.session_id);
      }

      tryForwardingSessionToSocket(socket, application_id, session_id, (err, sessionSocket) => {
        if (err) {
          return f(err);
        }

        socket._state_.SELECTED = {session_id: session_id,application_id :application_id};
        f();
      });
    });

    // @todo setup a bi-directionnal tunnel
    ['dom:isWatching'].forEach(evt => {
      socket.on(evt, (obj) => {
        if (!socket._state_.SELECTED) {
          return;
        }


        _sendToClient(socket._state_.SELECTED.session_id, socket._state_.SELECTED.application_id, evt, obj);
      });
    });

    // @todo limit in space and time
    socket.on('execute', (app_id, session_id, cmd, f) => {
      if (!isAuthenticated) {// @todo not dry refactor this
        return wrap(f)(new Error('Unauthenticated'));
      }

      //
      // @TODO SECURITY check that the user has access to the session_id !
      //

      // @todo: ensure the user can execute code on the specified app_id

      execute(app_id, session_id, cmd, f);
    });
  })

  // public API
  return consoles;
};
