import UIRouterReact from 'ui-router-react';

module.exports = (api) => {
  const router : UIRouterReact = new UIRouterReact();

  const organizations = require('./organizations/organizations')(api, router);

  router.stateService.defaultErrorHandler(function(err) {
    // Do not log transitionTo errors
    console.error('transitionTo error', err);
  });

  // set default state
  router.urlRouterProvider.otherwise(organizations.state.url);

  window.router = router;

  return router;

}
