module.exports = (server, models) => {
  assert(_.isObject(server));
  assert(_.isObject(models));

  const wrap = require('./wrap'); // @todo use IoC
  const io = require('socket.io')(server);

  const clients = require('./namespaces/clients')(io, wrap, models);
  const consoles = require('./namespaces/consoles')(clients, io, models, wrap);

  return {
    clients,
    consoles
  }
};
