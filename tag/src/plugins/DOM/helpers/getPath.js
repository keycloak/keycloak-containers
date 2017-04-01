/* @flow */

// https://github.com/fczbkk/css-selector-generator <= sucks on ny times home page not mine
// @todo put here the other lib I tested
// https://github.com/Autarc/optimal-select <= sucks
// https://github.com/micnews/css-path <= sucks

function isElement(element): boolean {
  return !!((element != null
    ? element.nodeType
    : void 0) === 1);
}

function getParents(element) {
  let result = [];
  if (isElement(element)) {
    let current_element = element;
    while (isElement(current_element)) {
      result.push(current_element);
      current_element = current_element.parentNode;
    }
  }
  return result;
};

let REGEXP = /[ !"#$%&'()*+,.\/;<=>?@\[\\\]^`{|}~]/;

function getTagSelector(element) {
  return sanitizeItem(element.tagName.toLowerCase());
}

function sanitizeItem(item: string): string {
  var characters;
  characters = (item.split('')).map(function(character) {
    if (character === ':') {
      return "\\" + (':'.charCodeAt(0).toString(16).toUpperCase()) + " ";
    } else if (REGEXP.test(character)) {
      return "\\" + character;
    } else {
      return global.escape(character).replace(/\%/g, '\\');
    }
  });
  return characters.join('');
}

function getNthChildSelector(element): ?string {
  let parent_element = element.parentNode;
  if (parent_element != null) {
    let counter = 0;
    let siblings = parent_element.childNodes;
    for (let k = 0, len = siblings.length; k < len; k++) {
      let sibling = siblings[k];
      if (isElement(sibling)) {
        counter++;
        if (sibling === element) {
          return ":nth-child(" + counter + ")";
        }
      }
    }
  }
  return null;
};

function getUniqueSelector(element) { // ~330ms
  const tag = getTagSelector(element);

  if (tag === 'html' || tag === 'body') {
    return tag;
  }

  const nthChild = getNthChildSelector(element);

  if (nthChild != null) {
    return (tag || '') + nthChild;
  }

  return '*';
};

function getSelector(element: any): ?string {
  if (!isElement(element)) {
    // not an element, yield null
    return null;
  }

  return getParents(element).reverse().map(getUniqueSelector).join(' > ');
};

getSelector.isElement = isElement;
module.exports = getSelector;
