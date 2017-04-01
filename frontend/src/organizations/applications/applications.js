/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import {UIView} from 'ui-router-react';
import {get, defer} from 'lodash';
const classNames = require('classnames');

const ApplicationMenu = require('./ApplicationMenu')(React);



const filter = require('lodash/filter');



module.exports = (api : Object, {stateService, stateRegistry} : {
  stateService: Object,
  stateRegistry: Object
}, organizationsState) => {

  function openApplication(app) {
    stateService.go(sessions.state, {
      ...stateService.params,
      organization_id:app.organization_id,
      application_id: app.application_id
    });
  }

  let openMenu = false;

  const applicationsState = stateRegistry.register({
    parent: organizationsState,
    name: 'applications',
    url: '/:organization_id/applications',

    onEnter: (trans) => {
      if (trans.params().application_id) {
        return;
      }

      return trans.injector().getAsync('applications').then(applications => {
        const application_id = get(applications, '[0].application_id');
        if (!application_id) {
          return;
        }
        return stateService.go(sessions.state, {
          ...trans.params(),
          application_id
        });
      });
    },

    component: (a) => {
      const {
        applications,
        organizations,
        $stateParams: {
          application_id,
          organization_id
        }
      } = a.resolves;

      return <div>
        <ApplicationMenu
          openApplication={openApplication}

          application_id={application_id}
          organization_id={organization_id}

          applications={applications}
          organizations={organizations}
        >
        </ApplicationMenu>
        <UIView/>
      </div>
    },

    resolve: [
      {
        token: 'applications',
        deps: ['$transition$'],
        resolveFn: (trans) => {
          return api.getAllApplications()
        }
      }
    ]
  });

  const setup = require('./setup/setup')(api, {
    stateService,
    stateRegistry
  }, applicationsState);

  const sessions = require('./sessions/sessions')(api, {
    stateService,
    stateRegistry
  }, applicationsState, setup.state);

  return {state: applicationsState};
};
