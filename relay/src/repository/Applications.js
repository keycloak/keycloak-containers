module.exports = (pgPool) => {

  /**
   * @param  {String} userId (string uuid)
   * @param  {function} f(err, Array[String])
   */
  function getIdsForUserId(userId, f) {
    pgPool.query(`
      SELECT app.application_id as id from organization_user
      INNER JOIN application app using(organization_id)
      WHERE organization_user.user_id =
      $1::uuid`, [userId], function(err, result) {
      // console.log('getIdsForUserId(%s)', err, result);
      if (err) {
        return f(err);
      }

      f(null, result.rows.map((row) => row.id.toString()));
    });
  }

  return {getIdsForUserId};
};
