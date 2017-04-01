const request = require('requestretry');

module.exports = (pgPool) => {
  assert(_.isObject(pgPool));

  const parseLastSessionContext = (user) => {
    user.lastSessionContext = JSON.parse(user.lastSessionContext);
    return user;
  }

  /**
   * BEWARE THIS METHOD IS UNSAFE (you have to check that the user can access the application_id)
   * @param  {String} jwt (string)
   * @param  {String} userId (string uuid)
   * @return {Promise}
   */
  function getOnlineApplicationUsers(jwt, application_id, userIdsForApplicationId) {

    const onlineUserIdsForApplication = userIdsForApplicationId(application_id);

    function addOnlineStatus(user){
      user.isOnline = onlineUserIdsForApplication.indexOf(user.user_id) !== -1;
      return user;
    }

    return request({
      url: 'https://api.killbug.today/v0_application_user',
      qs:{
        application_id: `eq.${application_id}`
      },
      json: true,
      fullResponse: false,
      headers:{
        Prefer: 'return=representation',
        Authorization: `Bearer ${jwt}`
      }
    }).then(users => users.map(flow(parseLastSessionContext, addOnlineStatus)));
  }

  return {getOnlineApplicationUsers};
};
