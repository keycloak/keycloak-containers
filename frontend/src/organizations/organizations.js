/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import {UIView} from 'ui-router-react';
import {get, size, defer} from 'lodash';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

module.exports = (api : Object, {stateService, stateRegistry} : {
  stateService: Object,
  stateRegistry: Object
}) => {

  const organizationsState = stateRegistry.register({
    name: 'organizations',
    url: '/organizations',
    resolve: [
      {
        token: 'organizations',
        deps: [],
        resolveFn: () => api.getAllOrganizations()
      }
    ],

    // https://ui-router.github.io/docs/latest/interfaces/state.statedeclaration.html#onenter
    onEnter: (trans, state) => {
      if (trans.params().organization_id) {
        return;
      }

      return trans.injector().getAsync('organizations').then(organizations => {
        const organization_id = get(organizations, '[0].organization_id');
        if (!organization_id) {
          return;
        }

        // without a return the resolves will be fetched multiple times; once for each new transition. To avoid this, redirect the transition to the child by returning a $state.target() instead of calling $state.go().
        return stateService.go(applications.state, {organization_id});
      });
    },

    views:{
      'app-sidebar': ({resolves: {
          organizations
        }}) => {
          return (<div>ok</div>);
        },
      'app-content':({resolves: {
          organizations
        }}) => {

        return (
          <UIView/>
        );
      }
    }
  });

  const applications = require('./applications/applications')(api, {
    stateService,
    stateRegistry
  }, organizationsState);

  function openOrganization(__, ___, organization_id) {
    // https://ui-router.github.io/docs/latest/classes/state.stateservice.html#go
    stateService.go(applications.state, {organization_id});
  }

  return {state: organizationsState}
};
