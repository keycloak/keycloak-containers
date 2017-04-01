const pg = require('pg');

module.exports = (config, f) => {
  assert(_.isPlainObject(config.pgconfig));
  assert(_.isString(config.pgconfig.schema));

  const pgPool = new pg.Pool(config.pgconfig);

  pgPool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack);
    throw err;
  })


  // test the connection to our database (search_path should be at the user level not the transaction level)
  pgPool.query(`SET search_path TO ${config.pgconfig.schema}`, (err, ok) => {
    if (err){
      return f(err);
    }

    return f(null, pgPool);
  });
};
