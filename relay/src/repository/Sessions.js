module.exports = (pgPool) => {

  /**
   * @param  {Object}  {session_id, application_id, user_id}
   * @param  {function} f(err)
   */
  function insert({session_id, application_id, user_id}, f) {
    pgPool.query(`
      INSERT INTO application_session (session_id, application_id, user_id) VALUES ($1, $2::uuid, $3)`, [session_id, application_id, user_id], function(err, result) {
      if (err) {
        return f(err);
      }

      f(null);
    });
  }

  // yield a promise
  function appendContext({session_id, context}, timeout= 5000){
    return Promise.resolve(pgPool.query(`UPDATE application_session SET context = $1::jsonb WHERE session_id=$2::varchar RETURNING *`, [context, session_id])).timeout(5000).then(result => {
      if(result.rowCount !== 1){
        return Promise.reject(new Error('Session does not exist'));
      }

      return result;
    })
  }

  return {insert, appendContext};
};
