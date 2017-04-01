/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import {UIView} from 'ui-router-react';
import {size, defer} from 'lodash';
const SetupCard = require('./SetupCard')();
const EventEmitter = require('events').EventEmitter;
const extend = require('lodash').extend;

module.exports = (api : Object, {stateService, stateRegistry} : {
  stateService: Object,
  stateRegistry: Object
}, applicationState) => {

  function SetupState(){
    let shouldStopCheck = false;
    let CHECK_INTERVAL = 5000;
    const state = extend(new EventEmitter(), {
      hadRecordedSession: false,
      activeStep:1
    });

    function startChecking(application_id){
      if(shouldStopCheck){
        return;
      }

      api.getRecordedSessionsByApplicationId(application_id).then(sessions => {
        state.hadRecordedSession = size(sessions) > 0;

        if(state.hadRecordedSession){
          state.activeStep = 2;
          stopChecking();
        }

        state.emit('changed', state);

        setTimeout(() => startChecking(application_id), CHECK_INTERVAL);
      });
    }

    function stopChecking(){
      shouldStopCheck = true;
    }

    return {
      startChecking,
      stopChecking,
      state
    };
  }

  function onSetupDone(){
    // @todo find a way to reference sessions :)
    stateService.go('^', stateService.params, {reload:true});
  }

  const setupState = SetupState();

  const setupRouterState = stateRegistry.register({
    parent: applicationState,
    name: 'setup',
    url: '/:application_id/setup',

    onEnter: (transition, state) => {
      setupState.startChecking(transition.params().application_id);
    },

    onExit: setupState.stopChecking,

    component: ({
      resolves: {
        $stateParams: {
          application_id: application_id
        }
      }
    }) => {
      return <SetupCard state={setupState.state} application_id={application_id} endpoint={process.env.ENDPOINT} onSetupDone={onSetupDone} />;
    }
  });

  return {state: setupRouterState};
};
