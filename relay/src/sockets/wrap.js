const keys = require('lodash.keys');
// @todo use both on client & server-side
function wrap(f) {
  return function(err, res) {
    f(Serializer.toPrimitive(err), Serializer.toPrimitive(res));
  };
}

var SENTINEL = '$_TOO_BIG_$';

function isTooBig(value) {
  if (Array.isArray(value) && value.length > 10) {
    return true;
  }

  if (!Array.isArray(value) && typeof value === 'object' && value !== null && keys(value).length > 10) {
    return true;
  }

  return false;
}

function reduceObject(object, f, memo) {
  for (var key in object) {
    try{
      // On Mozilla some object introspection does not work
      memo = f(memo, object[key], key);
    } catch(err){
      console.error(key, err);
    }

  }
  return memo;
}

const funcToString = Function.prototype.toString;
const hasOwnProperty = Object.prototype.hasOwnProperty;

// String => String
function extractInterestingPartFromFunction(fSource){
  return fSource.substring(0, fSource.indexOf(')')+1);
}

// Function -> String
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/** Used to detect if a method is native. */
/** from lodash doc */
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

const handleFunctions = (f) => {
  const source = toSource(f);
  // @todo use special sentinel to explain that here we've got functions
  return reIsNative.test(source) ? '[native function]' : extractInterestingPartFromFunction(source.substring());
}

var Serializer = {
  toPrimitive: function toPrimitive(mixed, depth = 0) {
    var type = typeof mixed;


    if (mixed === null || type === 'boolean' || type === 'number') {
      return mixed;
    }

    if(depth > 2){ // put this condition always AFTER the small primitive types
      return SENTINEL;
    }

    if(type === 'string'){
      // @todo handle large string
      return mixed;
    }

    if(type === 'function'){
      return handleFunctions(mixed);
    }

    if(type === 'object' && mixed instanceof Error){
      return {
        type: mixed.type || 'error',
        message: mixed.message
      };
    }

    if(depth === 3 && isTooBig(mixed)){ // for array & object
      return SENTINEL;
    }

    if (Array.isArray(mixed)) {
      return isTooBig(mixed)
        ? SENTINEL
        : mixed.map(function(value) {
          if (isTooBig(value)) {
            return SENTINEL;
          }

          return toPrimitive(value, depth + 1);
        });
    }



    if (type === 'object') {
      return reduceObject(mixed, function(memo, v, k) {
        memo[k] = toPrimitive(v, depth + 1);
        return memo;
      }, {});
    }

    return mixed;
  },
  fromPrimitive: function fromPrimitive(str) {}
};

if (typeof module !== 'undefined') {
  module.exports = {
    SENTINEL: SENTINEL,
    Serializer: Serializer,
    wrap: wrap
  };
}
