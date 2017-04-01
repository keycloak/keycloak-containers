const parserUA = require('ua-parser-js');

module.exports = (models, executeOnSocket) => {
  assert(_.isObject(models));
  assert(_.isFunction(executeOnSocket));

  /**
   * @param {Array[metricsWithResult]}
   * @type {Array[metric]} yield an array of metric with added ".value" property
   */
  const cleanResults = flow(map(({metric, result, error}) => {
    metric.value = result; // result will be null (in case of error or even valid result) or a primitive/object
    return metric;
  }));

  /**
   * How many concurrent execute should run in parallel per socket
   * @type {Number}
   */
  const CONCURRENT_ASK_PER_SOCKET = 2;

  /**
   * How many key/value should we store per session
   */
  const MAX_OBJECT_KEYS_NUMBER = 30;

  /**
   * How long the maximum stored string should have
   * @type {Number}
   */
  const MAX_STRING_LENGTH = 100;

  const NUMBER = 'number';
  const STRING = 'string';
  const BOOLEAN = 'boolean';

  /**
   * @param  {[type]}  mixed [description]
   * @return {Boolean}       true if `mixed` is a primitive (value)
   */
  function isPrimitive(mixed){
    const type = typeof mixed;
    return type === NUMBER || type === STRING || type === BOOLEAN;
  }

  /**
   * Take a metricExecuteResult and check that the metric has only primitive value (string/number/bool) and less than 21 keys (if it's an object)
   * @return {Promise[metricExecuteResult, Error]}
   */
  function ensureMetricCanBeSaved(metricExecuteResult){
    if(!isPrimitive(metricExecuteResult) && !_.isPlainObject(metricExecuteResult)){
      // @todo use a native exception
      return Promise.reject(new Error('Invalid result (not a plain object or a primitive value (number/string/boolean))'));
    }

    if(_.isString(metricExecuteResult) && metricExecuteResult.length > MAX_STRING_LENGTH){
      return Promise.reject(new Error(`Invalid result (string too long ${metricExecuteResult.length} > ${MAX_STRING_LENGTH})`));
    }

    const objLength = Object.keys(metricExecuteResult).length;
    if(objLength > MAX_OBJECT_KEYS_NUMBER){
      return Promise.reject(new Error(`Invalid result (object too big ${objLength} > ${MAX_OBJECT_KEYS_NUMBER})`));
    }

    if(!toPairs(metricExecuteResult).every(([key, value]) => isPrimitive(value))){
      return Promise.reject(new Error(`Invalid result (object contains some non-primitive values)`));
    }

    // Valid object, save it
    return metricExecuteResult;
  }

  /**
   * Create a context for this socket, the context will always have
   * @param  {Object} socket a socket.io socket
   * @param  {Object, Null} tagContext
   */
  function attachContext(socket, application_id, tagContext = {}){
    const context = {};

    // (sync) add tag.*
    context.tag = tagContext;

    // (sync) add core.*
    context.core = pick(['browser', 'os'], parserUA(socket.handshake.headers['user-agent'])) || {}; // connection tagContext

    // (model) (async) get related metrics from app_id
    models.Metrics.getForApplicationId(application_id).then((metrics) => {
      // (socket) (async) retrieve metrics
      return Promise.map(metrics
      , (metric) => executeOnSocket(socket, metric.script)
        .then(ensureMetricCanBeSaved)
        .then((result) => ({metric: metric, result: result, error: null}))
        .catch(err => ({metric: metric, result: null, error: err}))
      , {concurrency: CONCURRENT_ASK_PER_SOCKET});
    })
    .then(metricsWithResults => {
      // currently we do not want to keep the errors, so drop them and reformat the data
      const cleanedResults = cleanResults(metricsWithResults);

      // add metric.*
      context.metric = cleanedResults;

      // in case of resolution error, use undefined as key value
      // then save the ctx object in database for the session
      return models.Sessions.appendContext({session_id: socket.id, context: context}).tap(() => {
        // set context to the socket
        socket._state_.context = context;
      });
    })
    .catch((err) => {
      if(err){
        console.error('Could not save context', err);
        return;
      }
    });
  }

  return {
    attachContext
  }
};
