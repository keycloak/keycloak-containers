const config = require('common-env/withLogger')(console).getOrElseAll({
  auth0:{
    client:{
      id: '',
      secret:''
    }
  }
});

config.pgconfig = {
  schema: process.env.POSTGRESQL_ADDON_SCHEMA,
  user: process.env.POSTGRESQL_ADDON_USER, //env var: PGUSER
  database: process.env.POSTGRESQL_ADDON_DB, //env var: PGDATABASE
  password: process.env.POSTGRESQL_ADDON_PASSWORD, //env var: PGPASSWORD
  host: process.env.POSTGRESQL_ADDON_HOST, // Server hosting the postgres database
  port: process.env.POSTGRESQL_ADDON_PORT, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

module.exports = config;
