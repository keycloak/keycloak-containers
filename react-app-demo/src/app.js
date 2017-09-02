import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import {Router, Route, browserHistory} from "react-router";
import {syncHistoryWithStore} from "react-router-redux";
import thunk from "redux-thunk";
import state from "./reducers";
import App from "./components/App";
import Home from "./components/Home";
import Keycloak from "keycloak-js";
import axios from "axios";

const store = createStore(
  state,
  applyMiddleware(thunk)
);

const history = syncHistoryWithStore(browserHistory, store);

const app = (
  <Provider store={store}>
    <Router history={history}>
      <Route component={App}>
        <Route path="/" component={Home}/>
      </Route>
    </Router>
  </Provider>
);

const kc = Keycloak({
    url: 'http://localhost:8080/auth',
    realm: 'killbug',
    clientId: 'web-app'
});

kc.init({onLoad: 'check-sso'}).success(authenticated => {
  if (authenticated) {
    store.getState().keycloak = kc;

    setInterval(() => {
      kc.updateToken(10).error(() => kc.logout());
    }, 10000);
    ReactDOM.render(app, document.getElementById('app'));
  } else {
    // Not authenticated, go to login page
    kc.login();
  }
});

axios.interceptors.request.use(config => {
  config.headers = {...config.headers, ...{
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + kc.token
  }};
  return config;
});
