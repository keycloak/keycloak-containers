const throttle = require('lodash.throttle');

// https://developer.mozilla.org/en-US/docs/Web/Events
// Listen to DOM & DOM changes

const serialize = require('dom-serialize');
const throttle = require('lodash.throttle');

module.exports = () => {

  function _handleDOMChange() {
    document.title = 'DOM Changed at ' + new Date();
  }
  // Listen to DOM & DOM changes

  function start() {
    let loading = false;

    // first setup handler
    document.body.addEventListener('DOMSubtreeModified', _handleDOMChange, false);

    // track user events (and debounce them)
    [
      'cached',
      'error',
      'load',
      'mouseover',
      'select',
      // A pointing device is moved over an element. (Fired continously as the mouse moves.)
      'mousemove',
      // 	A pointing device button (ANY button) is pressed on an element.
      'mousedown',
      // ANY key is pressed
      'keydown'
    ].forEach()
    document.body.addEventListener('load')
    $(document).bind("DOMSubtreeModified", function() {
      debugger;
    });
  }
  return {start, stop};
};
