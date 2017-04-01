'use strict';
/* @flow */

/**
 * DOM Mirror
 */

const domEventListener = require('dom-event-listener');
const serialize = require('./helpers/serialize');
const getPath = require('./helpers/getPath');
const isElement = getPath.isElement;

module.exports = (socket : any) => {
  var _observer;

  const ATTRIBUTES = 'attributes';
  const CHILDLIST = 'childList';

  // Element -> Element|Null
  function getSafe(node : any, dir, ifFound) {
    while (node.nodeType !== 1) {
      if (!node[dir]) {
        break;
      }
      node = node[dir];
    }

    if (node.nodeType !== 1 && node.parentNode) {
      // if it did not work looking for left or right, go to the parent
      node = node.parentNode;
    }

    return node.nodeType === 1
      ? node
      : null;
  }

  function emit(evt, msg) : void {
    socket.emit(evt, msg);
  }

  function emitChange(node) {
    emit('dom:change', {
      html: serialize(node),
      target: getPath(node)
    });
  }

  // MESSAGE TYPES
  // dom:change {html: 'html-element', target: 'css-selector'}
  // dom:addition {html: '', appendTo: 'css-selector')
  // dom:addition {html: '', prependTo: 'css-selector')

  // Listen to DOM & DOM changes
  function start() {
    let loading = false;

    // first setup handler
    // create an observer instance
    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    _observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {

        Array.from(mutation.addedNodes).forEach((node) => {

          if (mutation.type === CHILDLIST) {
            // forcément append / prepend
            if (mutation.previousSibling && !mutation.nextSibling) {
              emit('dom:addition', {
                html: serialize(node),
                appendTo: getPath(mutation.target)
              });
            } else if (mutation.nextSibling && !mutation.previousSibling) {
              emit('dom:addition', {
                html: serialize(node),
                prependTo: getPath(mutation.target)
              });
            } else {
              console.error('not supported');
              debugger;
            }
          } else {
            console.error('not supported');
            debugger;
          }
        });

        if (mutation.removedNodes.length > 0) {
          if (mutation.type === CHILDLIST) {
            // no need to do something complex, simply rerender the whole target
            // let's simply say that the target interely changed, serialize it and replace it
            emitChange(mutation.target);
          } else {
            console.error('not supported');
            debugger;
          }
        }

        if (mutation.type === ATTRIBUTES) {
          // Retourne le noeud affecté par la mutation, et cela, en fonction du type.
          // Pour les attributes, c'est l'élément dont l'attribut à changé.
          // Pour childList, c'est le noeud dont les enfants ont changé.
          emitChange(mutation.target);
        }
      });
    });

    _observer.observe(window.document, {
      // Set to true if additions and removals of the target node's child elements (including text nodes) are to be observed.
      childList: true,
      // Set to true if mutations to target's attributes are to be observed.
      attributes: true,
      // Set to true if mutations to target's data are to be observed.
      characterData: true,
      // Set to true if mutations to target and target's descendants are to be observed.
      subtree: true
    });

    sendFullDOM();
  }

  let lastDocStr = null; // little optim
  function sendFullDOM() {
    // then serialize DOM
    const docStr = serialize(document);
    if (docStr !== lastDocStr) {
      lastDocStr = docStr;
      emit('dom:full', docStr);
    }
  }

  function stop() {
    if (!_observer) {
      return;
    }
    _observer.disconnect();
  }

  socket.on('dom:isWatching', (isWatching) => {
    console.info('Op is watching DOM changes', isWatching);
    stop();

    if (isWatching) {
      start();
    }
  })

  // start(); // debug

  return {start, stop};
};
