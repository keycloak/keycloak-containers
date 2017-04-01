/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import {UIView} from 'ui-router-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Promise from 'bluebird';

const auth = require('./auth');
const api = require('./api')(auth);

// Router
const router = require('./router')(api);

const Loader = require('./Loader')(React);

// Setup Material-UI
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(<MuiThemeProvider>
  <div className="app">
    <Loader transitionService={router.transitionService}/>
    <UIView className="app-header" name="app-header"/>
    <UIView className="app-sidebar" name="app-sidebar"/>
    <UIView className="app-content" name="app-content"/>
  </div>
</MuiThemeProvider>, document.getElementById('app'));


if(process.env.NODE_ENV === 'development'){
  require('ui-router-visualizer').visualizer(router);
}


auth.on('connected', () => {
  router.start();
});

auth.login();
