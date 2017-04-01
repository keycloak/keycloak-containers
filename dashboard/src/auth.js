/* @flow */

import Auth0Lock from 'auth0-lock';
const EventEmitter = require('events').EventEmitter;

// clientId - domain
const lock = new Auth0Lock('zxNca1tvRmnf032pQ3iGAVbKODAUomGT', 'bugkill.eu.auth0.com', {
  autofocus: true,
  autoclose: true,
  closable: true,
  auth: {
    sso: false,
    redirect: false
  }
});

const em = new EventEmitter();

const JWT_STORAGE_KEY = 'jwt';
const JWT_STORAGE_PROFILE = 'profile';

const MOCK = true;

function login() {
  console.log('login');
  if (getJWT()) {
    console.log('got jwt from localstorage', getJWT());
    tryJWT(getJWT());
    return;
  }

  lock.once('authenticated', function(authResult) {
    console.log('(authenticated) authResult', authResult);
    tryJWT(authResult.idToken);
  });

  lock.show();
}

function getJWT() : ?string {
  return localStorage.getItem(JWT_STORAGE_KEY);
}

function getProfile(): ?string {
  return localStorage.getItem(JWT_STORAGE_PROFILE);
}

function logout() {
  localStorage.removeItem(JWT_STORAGE_KEY); // model
  window.location.reload();
}

function tryJWT(jwt: ?string) {

  lock.getProfile(jwt, function(error, profile) {


    if (error && !MOCK) {
      console.error('error', error);
      if (error.error === 401) {
        logout();
      }
      return;
    }

    // model
    localStorage.setItem(JWT_STORAGE_KEY, jwt);
    localStorage.setItem(JWT_STORAGE_PROFILE, JSON.stringify(profile));

    em.emit('connected');
  });
}

em.login = login;
em.logout = logout;
em.getJWT = getJWT;
em.getProfile = getProfile;


module.exports = em;
