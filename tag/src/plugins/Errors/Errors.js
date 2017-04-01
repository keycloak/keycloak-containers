'use strict';
const Raven = require('raven-js');
const RavenConsole = require('raven-js/plugins/console');

module.exports = (socket) => {
  // First apply patch
  // then load Raven
  RavenConsole(Raven);
  Raven.config(`https://killbugtoday.internal/`, {
    debug: true,
    transport: function(options) {
      const data = {
        message:options.data.message,
        logger:options.data.logger,
        level:options.data.level,
        extra:options.data.extra,
        breadcrumbs:options.data.breadcrumbs
      };
      socket.emit('raven', data);
      options.onSuccess();
    },
    maxBreadcrumbs: 1,
    ignoreUrls: [],
    autoBreadcrumbs: {
      'xhr': true, // XMLHttpRequest
      'console': false, // console logging
      'dom': true, // DOM interactions, i.e. clicks/typing
      'location': true // url changes, including pushState/popState
    }
  }).install();

};
