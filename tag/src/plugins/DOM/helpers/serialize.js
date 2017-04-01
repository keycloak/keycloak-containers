const serializeElement = require('./serializeElement');
const serialize = require('dom-serialize');

function handler(event) {
  const nodeType = event.serializeTarget.nodeType;
  if (nodeType === 1) {/* element */
    event.detail.serialize = serializeElement(event.serializeTarget, event.detail.context, event.target);
  } else if (nodeType === 8/* comment */) {
    event.detail.serialize = ''; // don't serialize text nodes
  }
}

module.exports = (node)  => serialize(node, handler)
