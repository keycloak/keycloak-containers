'use strict';

const {serializeAttribute, serializeNodeList} = require('dom-serialize');
const GetAppliedStyles = require('./getAppliedStyles');
const voidElements = require('void-elements');

// extracted from dom-serialize
module.exports = function serializeElement (node, context, eventTarget) {
  var c, i, l;
  var name = node.nodeName.toLowerCase();


  // opening tag
  var r = '<' + name;

  // attributes (added "|| []")
  for (i = 0, c = node.attributes || [], l = c.length; i < l; i++) {
    if(name !== 'script' && c[i] !== 'src'){
      r += ' ' + serializeAttribute(c[i]);
    }
  }

  // ADD BY FG
  // style
  // const style = GetAppliedStyles(node);
  // if(style.length > 0){
  //   r += ' style="'+style.join(';')+'"';
  // }
  // \ADD BY FG

  r += '>';

  if(name !== 'script'){ // ADD BY FG: do NOT serialize js scripts (but still yield the node)
    // child nodes
    r += serializeNodeList(node.childNodes, context, null, eventTarget);
  }

  // closing tag, only for non-void elements
  if (!voidElements[name]) {
    r += '</' + name + '>';
  }

  return r;
}
