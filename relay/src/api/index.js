const parserUA = require('ua-parser-js');
const cors = require('cors');

const DEBUG_MODE = false;
module.exports = (app, models, clients) => {
  assert(_.isFunction(clients.socketsForApplicationIds));
  assert(_.isFunction(clients.userIdsForApplicationId));

  app.use(cors());
  app.options('*', cors()) // include before other routes

  app.get('/api*', (req, res, next) => {
    // be sure the user is authenticated
    const access_token = String(_.get(req, 'query.access_token') || _.get(req, 'headers.authorization')).replace('Bearer ', '');

    if (!access_token) {
      return next(new Error('Missing `Authorization: Bearer <token>` header'));
    }

    models.Users.verifyJWT(access_token, (err, decoded) => {
      if (err || !_.isPlainObject(decoded)) {
        next(new Error('Invalid token'));
        return;
      }

      // attach user object
      req.user = {
        jwt: access_token,
        id: models.Users.extractUserIdFromJWTSub(decoded.sub)
      };

      next();
    });
  });

  app.get('/api', (req, res) => {});

  app.get('/api/v1/self', function(req, res) {
    models.Users.getSelf(req.user.id, (err, self) => {
      if (err) {
        console.error(err);
        return res.status(500).json(DEBUG_MODE
          ? err
          : {
            error: 'Invalid request'
          });
      }

      res.json(self);
    });
  });

  app.get('/api/v1/self/sessionsPerApplications', function(req, res) {
    // get user app ids
    models.Applications.getIdsForUserId(req.user.id, (err, applicationIds) => {
      if (err) {
        console.error(err);
        return res.status(500).json(DEBUG_MODE
          ? err
          : {
            error: 'Invalid request'
          });
      }

      // ask clients.sockets from matching appIds
      res.json(clients.socketsForApplicationIds(applicationIds));
    });
  });

  app.get('/api/v1/self/onlineUsersPerApplications', function(req, res) {
    const application_id = req.query.application_id;
    if(!application_id){
      res.status(400).json([]);
      return;
    }

    // get user app ids
    models.ApplicationUsers.getOnlineApplicationUsers(req.user.jwt, application_id, clients.userIdsForApplicationId)
    .then(users => res.json(users))
    .catch(err => {
      console.error(err);
      res.status(500).json(DEBUG_MODE ? err : {error: 'Invalid request'})
    });
  });
};
