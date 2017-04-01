'use strict';
const t = require('chai').assert;
const USER_ID_IN_PRODUCTION = '70522e86-1fcf-415f-aeda-9325f3413a6b';
const USER_EMAIL_IN_PRODUCTION = 'killbug@fgribreau.com';
const APPLICATION_ID = '0eb9c047-2c03-4e87-b13c-716bf65a130a';

describe('Repositories', () => {
  let Users;
  let Applications;
  let Sessions;
  let Metrics;

  beforeEach((f) => {
    const config = require('../config');
    require('../pgclient')(config, (err, pgPool) => {
      if (err) {
        f(err);
      }

      const obj = require('../models')(pgPool, config);
      Users = obj.Users;
      Sessions = obj.Sessions;
      Sessions.fixtures = require('./Sessions.fixtures');
      Applications = obj.Applications;
      Metrics = obj.Metrics;
      f();
    });
  });

  describe('Applications', () => {
    describe('getIdsForUserId', () => {
      it('works', (f) => {
        Applications.getIdsForUserId(USER_ID_IN_PRODUCTION, (err, appIds) => {
          t.strictEqual(err, null);
          t.deepEqual(appIds, ['0eb9c047-2c03-4e87-b13c-716bf65a130a', 'd6ae7e6c-6438-4823-aa68-1b19ec4aa238', '1a57a222-c770-4979-ba0c-8b7cae8cdfbb']);
          f();
        });
      })
    });
  });

  describe('Users', () => {

    it('findById', (f) => {
      Users.findById(USER_ID_IN_PRODUCTION, (err, user) => {
        t.strictEqual(err, null);
        t.deepEqual(pick(['email'], user), {email: USER_EMAIL_IN_PRODUCTION})
        f();
      });
    });

    it('getSelf', (f) => {
      Users.getSelf(USER_ID_IN_PRODUCTION, (err, user) => {
        t.strictEqual(err, null);
        t.deepEqual(pick(['email'], user), {email: USER_EMAIL_IN_PRODUCTION})
        t.isArray(user.organizations);
        t.isArray(user.organizations[0].applications);
        f();
      });
    });

    describe('verifyJWT', () => {
      it('should yield an error for an valid JWT', (f) => {
        Users.verifyJWT('eyJ0eXAiOiJKVqqqq1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2J1Z2tpbGwuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDcwNTIyZTg2LTFmY2YtNDE1Zi1hZWRhLTkzMjVmMzQxM2E2YiIsImF1ZCI6Inp4TmNhMXR2Um1uZjAzMnBRM2lHQVZiS09EQVVvbUdUIiwiZXhwIjoxNDgyNjI4NDQ4LCJpYXQiOjE0ODI1OTI0NDh9.AkR95KPaCdTcNY_TWsqug2O2azpG4UfnHTmge4HT7VY', (err, decoded) => {
          t.strictEqual(err.message, 'invalid signature');
          t.isUndefined(decoded);
          f();
        });
      });

      // it('should yield a decoded object for a valid JWT', (f) => {
      //   Users.verifyJWT('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2J1Z2tpbGwuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDcwNTIyZTg2LTFmY2YtNDE1Zi1hZWRhLTkzMjVmMzQxM2E2YiIsImF1ZCI6Inp4TmNhMXR2Um1uZjAzMnBRM2lHQVZiS09EQVVvbUdUIiwiZXhwIjoxNDgyNjk0OTgyLCJpYXQiOjE0ODI2NTg5ODJ9.b-fK4wmgWpWA450ot1PoYYKDF0kg7wn2yCmBakUZEvw', (err, decoded) => {
      //     t.strictEqual(err, null);
      //     t.isString(decoded.sub);
      //     f();
      //   });
      // });
    });
  });

  describe('Sessions', () => {
    describe('appendContext', () => {
      it('should append a context to the session', (f) => {
        const NEW_SESSION_ID = +new Date();
        Sessions.insert({session_id:NEW_SESSION_ID, application_id:APPLICATION_ID}, (err, success) => {
          t.strictEqual(err, null);
          Sessions.appendContext({session_id:NEW_SESSION_ID, context: Sessions.fixtures.simpleContext}).then(result => {
            t.strictEqual(result.rowCount, 1);
            f();
          }).catch(f);
        });
      });

      it('should yield an error a context to the session', () => {
        return Sessions.appendContext({session_id:'test', content: Sessions.fixtures}).catch(err => t.strictEqual(err.message, 'Session does not exist'));
      });
    });
  });


  describe('Metrics', () => {
    describe('getForApplicationId', () => {
      it('should yield metrics', () => {
        return Metrics.getForApplicationId(APPLICATION_ID).then((metrics) => {
          t.isArray(metrics);
          t.ok(metrics.length > 0);
        })
      });

      it('should yield no metrics', () => {
        return Metrics.getForApplicationId('00000000-0000-4e87-b13c-716bf65a130a').then((metrics) => {
          t.strictEqual(metrics.length, 0);
        })
      });

    });
  });
});
