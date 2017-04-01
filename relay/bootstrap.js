global.assert = require('assert');
global._ = require('lodash');
global.Promise = require('bluebird');

_.forEach(_.pick(require('lodash/fp'), 'omit,pick,values,merge,identity,mapValues,filter,tap,toPairs,flow,flatMap,map,uniq,get,compact,thru,groupBy'.split(',')), (v, k) => global[k] = v);
