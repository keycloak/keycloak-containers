module.exports = (pgPool) => {

  /**
   * @param  {String}  application_id ( a uuid)
   * @param  {Promise[Array[Metric], Error]}
   */
  function getForApplicationId(application_id) {
    return Promise.resolve(pgPool.query(`
      SELECT title, metric_id, script
      FROM metric
      WHERE application_id = $1::uuid AND "deletedAt" IS NULL
      `, [application_id])).then(res => res.rows);
  }


  return {getForApplicationId};
};
