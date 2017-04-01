const {sign, verify, decode} = require('jsonwebtoken');

module.exports = (pgPool, config) => {
  // auth0 -> @todo common-env
  assert(_.isString(config.auth0.client.id));
  assert(_.isString(config.auth0.client.secret));
  const AUTH_CLIENT_ID = config.auth0.client.id;
  const AUTH_CLIENT_SECRET = config.auth0.client.secret;

  // check jwt
  const verifyJWT = (jwt, f) => verify(jwt, AUTH_CLIENT_SECRET, f);

  const extractUserIdFromJWTSub = (sub) => sub.replace('auth0|', '');

  function findById(userId, f) {
    pgPool.query('SELECT * from organization_user_user where user_id = $1::uuid limit 1', [userId], function(err, result) {
      if (err){
        return f(err);
      }

      f(null, result.rows[0]);
    });
  }

  // Dummy methods yield everything we know about the user
  function getSelf(userId, f) {
    pgPool.query(`
      SELECT row_to_json(res) AS result
      FROM (
       SELECT
         org_user_user.email,
         org_user_user.email_verified,
         org_user_user."createdAt",
         array(SELECT row_to_json(orga)
               FROM (
                      SELECT
                        org.organization_id,
                        org.name,
                        org."createdAt",
                        array(SELECT row_to_json(app)
                              FROM (SELECT
                                      apps.application_id AS id,
                                      apps.name,
                                      apps."createdAt"
                                    FROM application apps
                                    WHERE apps.organization_id = org.organization_id) app) AS applications
                      FROM organization_user org_user
                      INNER JOIN organization org USING (organization_id)
                      WHERE org_user.user_id = org_user_user.user_id
                    ) orga) AS organizations
       FROM organization_user_user org_user_user
       WHERE org_user_user.user_id = $1::uuid
       LIMIT 1
     ) res`, [userId], function(err, result) {
      if (err){
        return f(err);
      }

      f(null, get('rows[0].result', result) || {});
    });
  }

  return {findById, verifyJWT, extractUserIdFromJWTSub, getSelf};
};
