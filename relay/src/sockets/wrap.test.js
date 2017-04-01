const {wrap, Serializer} = require('./wrap');
const _ = require('lodash');
const t = require('chai').assert;
const LARGE_ARR = _.range(0, 10000);

// client.js:1 GOT ERROR TypeError: b.toJSON is not a function
// sur Redsmin.app.servers =>
describe('wrap', () => {
  it('should wrap a function', (f) => {
    function cb(a, b) {
      t.deepEqual(a, {"message": "ok"});
      t.deepEqual(b, {"message": "hello world"});
      f();
    }

    wrap(cb)({
      message: 'ok'
    }, {message: 'hello world'});
  });

});

describe('Serializer', () => {
  describe('toPrimitive', () => {
    it('should work', () => {
      t.deepEqual(Serializer.toPrimitive(null), null);
    });

    it('should work', () => {
      t.deepEqual(Serializer.toPrimitive(undefined), undefined);
    });

    it('should work for errors', () => {
      t.deepEqual(Serializer.toPrimitive(new Error('Hello world')), {
        type: 'error',
        message: 'Hello world'
      });
    });

    it('should work with instance object', () => {
      function empty() {
        return true;
      }

      function MyConstructor() {
        this.a = 1;
        this.b = true;
        this.c = [1, 2, 3];
        this.f = empty;
      }

      const obj = new MyConstructor();

      t.deepEqual(Serializer.toPrimitive(obj), {
        a: 1,
        b: true,
        c: [
          1, 2, 3
        ],
        f: "function empty()"
      });
    });

    it('should be able to wrap the global object', (f) => {
      Serializer.toPrimitive(global);
      f();
    });

    it('should work', () => {
      t.deepEqual(Serializer.toPrimitive({
        a: 'ok',
        b: true,
        c: false,
        d: 0,
        e: _.range(0, 10),
        f: LARGE_ARR,
        g: {
          h: {
            i: {
              j: {
                k: LARGE_ARR
              }
            }
          }
        }
      }), {
        "a": "ok",
        "b": true,
        "c": false,
        "d": 0,
        "e": _.range(0, 10),
        "f": "$_TOO_BIG_$",
        "g": {
          'h':{
            'i': '$_TOO_BIG_$'
          }
        }
      });
    });
  });
});
