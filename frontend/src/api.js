/* @flow */
const request = require('superagent-use')(require('superagent'));

module.exports = ({getJWT}) => {

  const MOCK = false;

  const addAuthorization = (req) => {
    req.set('Authorization', `Bearer ${getJWT()}`);
    return req;
  };

  function addPrefix(placeholder, prefix) {
    return function(request) {
      request.url = request.url.replace(placeholder, prefix);
      return request;
    };
  }

  request.use(addAuthorization);

  request.use(addPrefix(':api:', 'https://api.killbug.today'));
  request.use(addPrefix(':local:', process.env.ENDPOINT));

  function extractBody(req) {
    return req.body;
  }

  function displayCache(json){
    console.log(JSON.stringify(json));
    return json;
  }

  function getAllOrganizations(a){
    return !MOCK ? a() : Promise.resolve([{"organization_id":"376ac58e-fd88-427f-be9e-9c6eb5a73f0f","subscription_id":null,"name":"iAdvize","createdAt":"2016-12-19T14:48:26.119164+00:00","updatedAt":"2016-12-19T14:48:26.119164+00:00","deletedAt":null},{"organization_id":"faec4b56-b4ad-4476-8612-e819f3344334","subscription_id":null,"name":"Redsmin","createdAt":"2016-12-18T15:21:51.545021+00:00","updatedAt":"2016-12-18T15:22:00.897008+00:00","deletedAt":null},{"organization_id":"286f2b8f-6468-4556-939a-85c2a69effee","subscription_id":null,"name":"FGtest orga","createdAt":"2016-12-28T15:12:24.398458+00:00","updatedAt":"2016-12-28T15:12:24.398458+00:00","deletedAt":null}]);
  }


function getRecordedSessionsByApplicationId(a){
  return !MOCK ? a() : Promise.resolve([{"session_id":"/client#L_q9Y7s91h41A3zSAAAD","application_id":"d6ae7e6c-6438-4823-aa68-1b19ec4aa238","user_id":null,"createdAt":"2016-12-28T13:05:24.608538+00:00","context":{"tag":{"clientId":"8903","platform":"sd","operatorId":"54525"},"core":{"os":{"name":"Mac OS","version":"10.11.6"},"browser":{"name":"Chrome","major":"55","version":"55.0.2883.95"}},"metric":[]}},{"session_id":"/client#Pdjx30lF_MQHY3GFAAAA","application_id":"d6ae7e6c-6438-4823-aa68-1b19ec4aa238","user_id":null,"createdAt":"2016-12-28T11:12:02.639066+00:00","context":{"tag":{"clientId":"8903","platform":"sd","operatorId":"54525"},"core":{"os":{"name":"Mac OS","version":"10.11.6"},"browser":{"name":"Chrome","major":"55","version":"55.0.2883.95"}},"metric":[]}},{"session_id":"/client#XnhUGZmopq81551tAAAA","application_id":"d6ae7e6c-6438-4823-aa68-1b19ec4aa238","user_id":null,"createdAt":"2016-12-28T10:48:23.622542+00:00","context":{"tag":{"clientId":"8903","platform":"sd","operatorId":"54525"},"core":{"os":{"name":"Mac OS","version":"10.11.6"},"browser":{"name":"Chrome","major":"55","version":"55.0.2883.95"}},"metric":[]}},{"session_id":"/client#hbILv48lnZWmpg7GAAAC","application_id":"d6ae7e6c-6438-4823-aa68-1b19ec4aa238","user_id":null,"createdAt":"2016-12-28T14:05:33.954641+00:00","context":{"tag":{"clientId":"8903","platform":"sd","operatorId":"54525"},"core":{"os":{"name":"Mac OS","version":"10.11.6"},"browser":{"name":"Chrome","major":"55","version":"55.0.2883.95"}},"metric":[]}},{"session_id":"/client#hqZ-3Oh7rx7luTqVAAAA","application_id":"d6ae7e6c-6438-4823-aa68-1b19ec4aa238","user_id":null,"createdAt":"2016-12-28T14:05:18.917802+00:00","context":{"tag":{"clientId":"8903","platform":"sd","operatorId":"54525"},"core":{"os":{"name":"Mac OS","version":"10.11.6"},"browser":{"name":"Chrome","major":"55","version":"55.0.2883.95"}},"metric":[]}},{"session_id":"/client#iZXfMbpiS-oLgw0UAAAB","application_id":"d6ae7e6c-6438-4823-aa68-1b19ec4aa238","user_id":null,"createdAt":"2016-12-28T11:12:29.35441+00:00","context":{"tag":{"clientId":"8903","platform":"sd","operatorId":"54525"},"core":{"os":{"name":"Mac OS","version":"10.11.6"},"browser":{"name":"Chrome","major":"55","version":"55.0.2883.95"}},"metric":[]}},{"session_id":"/client#j5HtgB0HopWQXpDbAAAC","application_id":"d6ae7e6c-6438-4823-aa68-1b19ec4aa238","user_id":null,"createdAt":"2016-12-28T12:11:41.490768+00:00","context":{"tag":{"clientId":"8903","platform":"sd","operatorId":"54525"},"core":{"os":{"name":"Mac OS","version":"10.11.6"},"browser":{"name":"Chrome","major":"55","version":"55.0.2883.95"}},"metric":[]}},{"session_id":"/client#kI09A4BgDAWFHbDOAAAB","application_id":"d6ae7e6c-6438-4823-aa68-1b19ec4aa238","user_id":null,"createdAt":"2016-12-28T14:05:32.758051+00:00","context":{"tag":{"clientId":"8903","platform":"sd","operatorId":"54525"},"core":{"os":{"name":"Mac OS","version":"10.11.6"},"browser":{"name":"Chrome","major":"55","version":"55.0.2883.95"}},"metric":[]}}]);
}

function getApplicationsByOrganizationId(a){
  return !MOCK ? a() : Promise.resolve([{"application_id":"d6ae7e6c-6438-4823-aa68-1b19ec4aa238","name":"Desk app","organization_id":"376ac58e-fd88-427f-be9e-9c6eb5a73f0f","createdAt":"2016-12-19T14:48:26.119164+00:00","updatedAt":"2016-12-19T14:48:26.119164+00:00","deletedAt":null}]);
}

function getAllLiveSessions(a){
  return !MOCK ? a() : Promise.resolve([]);
}

  return {
    // Yield orga & apps
    getSelf: () => request.get(':api:/self').then(extractBody).then(displayCache),

    getAllOrganizations: () => getAllOrganizations(() => request.get(':api:/organization').then(extractBody)),
    getAllApplications: () => request.get(':api:/application').then(extractBody).then(displayCache),
    getApplicationsByOrganizationId: (organization_id : string) => getApplicationsByOrganizationId(() => request.get(':api:/application').query({organization_id: `eq.${organization_id}`}).then(extractBody)),

    // get RecordedSessions (live or not)
    getRecordedSessionsByApplicationId: (application_id: string) => getRecordedSessionsByApplicationId(() => request.get(':api:/application_session').query({application_id: `eq.${application_id}`}).then(extractBody)).then(sessions => {
      return sessions.map(session => {
        session.session_id_safe = session.session_id.split('#')[1];
        return session;
      });
    }),

    // deprecated api (soon to be merged back into postgrest)
    getAllLiveSessions: () => getAllLiveSessions(() => request.get(':local:/api/v1/self/sessionsPerApplications').then(extractBody))
  };

};
