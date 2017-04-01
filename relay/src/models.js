module.exports = (pgclient, config) => {
  assert(_.isObject(pgclient));
  assert(_.isObject(config));

  const Users = require('./repository/Users')(pgclient, config);
  const Sessions = require('./repository/Sessions')(pgclient);
  const ApplicationUsers = require('./repository/ApplicationUsers')(pgclient);
  const Applications = require('./repository/Applications')(pgclient);
  const Metrics = require('./repository/Metrics')(pgclient);

  return {
    Users,
    Sessions,
    Applications,
    ApplicationUsers,
    Metrics
  };
};
