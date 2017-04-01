/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import {UIView} from 'ui-router-react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

import {size, defer} from 'lodash';

module.exports = (api : Object, {stateService, stateRegistry} : {
  stateService: Object,
  stateRegistry: Object
}, applicationState, setupState) => {

  function selectSession(__, ___, session_id) {
    stateService.go(liveSessionsState, {...stateService.params, session_id:session_id}, {reload:true});
  }

  console.log(applicationState);

  const liveSessionsState = stateRegistry.register({
    parent: applicationState,
    name: 'sessions',
    url: '/:application_id/sessions',

    resolve: [
      {
        token: 'liveSessions',
        deps: ['$transition$'],
        resolveFn: (trans) => {
          return api.getAllLiveSessions();
        }
      },
      {
        token: 'recordedSessions',
        deps: ['$transition$'],
        resolveFn: (trans) => {
          return api.getRecordedSessionsByApplicationId(trans.params().application_id);
        }
      }
    ],

    onEnter: (trans, state) => {
      trans.injector().getAsync('recordedSessions').then(recordedSessions => {
        if(size(recordedSessions) > 0){
          return;
        }

        // if no recorded sessions
        //  => switch to the setup part
        defer(() => { // I had to put a defer here because otherwise ui-router crashed with "Param values not valid for state"
          stateService.go(setupState, trans.params());
        });
      });

      //
      // if live sessions
      //  =>
      // if recorded sessions
      //  =>
      // if (!trans.params().organization_id){
      //   return trans.injector().getAsync('organizations').then(organizations => {
      //     const organization_id = get(organizations, '[0].organization_id');
      //     if(organization_id){
      //       stateService.go(applications.state, {organization_id});
      //     }
      //   });
      // }
    },


    views:{
      '$default':({resolves: {
          recordedSessions
        }}) => {

        return (
          <div>
            <DropDownMenu value={stateService.params.session_id} onChange={selectSession} autoWidth={true} style={({width:400})}>
              {recordedSessions.slice(0, 10).map(session => <MenuItem key={session.session_id_safe} value={session.session_id_safe} primaryText={session.session_id_safe}/>)}
            </DropDownMenu>
            <UIView/>
          </div>
        );
      },
      '!$default.app-content':({resolves: {
          liveSessions
        }}) => {
        return (
          <div>
            <h3>live Sessions list</h3>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderColumn>ID</TableHeaderColumn>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Status</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableRowColumn>1</TableRowColumn>
                    <TableRowColumn>John Smith</TableRowColumn>
                    <TableRowColumn>Employed</TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>2</TableRowColumn>
                    <TableRowColumn>Randal White</TableRowColumn>
                    <TableRowColumn>Unemployed</TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>3</TableRowColumn>
                    <TableRowColumn>Stephanie Sanders</TableRowColumn>
                    <TableRowColumn>Employed</TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>4</TableRowColumn>
                    <TableRowColumn>Steve Brown</TableRowColumn>
                    <TableRowColumn>Employed</TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        );
      }
    }

  });

  return {state: liveSessionsState};
};
