/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	if ((typeof killbugtodaySettings === 'undefined' ? 'undefined' : _typeof(killbugtodaySettings)) !== 'object' || typeof killbugtodaySettings.app_id !== 'string') {
	  throw new Error('`killbugtodaySettings` must be a global object and contain an `app_id` property with a string value.');
	}

	//const {wrap, Serializer} = require('../../relay/src/sockets/wrap');
	//const io = require('socket.io-client');

	var WS = __webpack_require__(1).w3cwebsocket;

	// Note: No auth on tag (cannot authenticate users from our clients)
	// 2nd note: route not definitive
	var client = new WS('ws://' + ("localhost:80") + '/pubsub/' + killbugtodaySettings.app_id); // from Nchan we can extract this route param with $1

	//const socket = io(process.env.ENDPOINT+'/client', {});

	client.onerror = function () {
	  console.log('Connection Error');
	};

	client.onopen = function () {
	  //To send msg => client.send(msg)

	  console.log('WebSocket Client Connected');
	};

	client.onclose = function () {
	  console.log('WebSocket Client Closed');
	};

	client.onmessage = function (e) {
	  // @todo Check type message (execute, etc.)

	  f = wrap(f);
	  try {
	    var res = eval(cmd);
	    // console.log(cmd, " => (",typeof res, ") ", Serializer.toPrimitive(res));
	    // console.debug(Serializer.toPrimitive(res));
	    f(null, res);
	  } catch (err) {
	    console.error('GOT ERROR', err);
	    f(err);
	  }
	};

	// Plugins
	//const Errors = require('./plugins/Errors/Errors')(socket);
	//require('./plugins/DOM')(socket);

	// @todo ensure APP_ID & USER_IDENTITY (string) & CUSTOM_DATA (optional) are defined

	// @todo send at authentication level
	/*
	socket.on('handshake', function(f) {
	  f(null, {
	    app_id: killbugtodaySettings.app_id,
	    context: killbugtodaySettings.context
	  });
	});
	*/

	/*
	socket.on('forwarding', () => {
	  // console.log('forwarding');
	  // DOM.stop();
	  // DOM.start();
	});

	socket.on('forwarding:stopped', () => {
	  // DOM.stop();
	});

	socket.on('execute', function(cmd, f) {
	  f = wrap(f);

	  try {
	    const res = eval(cmd);
	    // console.log(cmd, " => (",typeof res, ") ", Serializer.toPrimitive(res));
	    // console.debug(Serializer.toPrimitive(res));
	    f(null, res);
	  } catch (err) {
	    console.error('GOT ERROR', err);
	    f(err);
	  }
	});
	*/

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var _global = (function() { return this; })();
	var NativeWebSocket = _global.WebSocket || _global.MozWebSocket;
	var websocket_version = __webpack_require__(2);


	/**
	 * Expose a W3C WebSocket class with just one or two arguments.
	 */
	function W3CWebSocket(uri, protocols) {
		var native_instance;

		if (protocols) {
			native_instance = new NativeWebSocket(uri, protocols);
		}
		else {
			native_instance = new NativeWebSocket(uri);
		}

		/**
		 * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
		 * class). Since it is an Object it will be returned as it is when creating an
		 * instance of W3CWebSocket via 'new W3CWebSocket()'.
		 *
		 * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
		 */
		return native_instance;
	}


	/**
	 * Module exports.
	 */
	module.exports = {
	    'w3cwebsocket' : NativeWebSocket ? W3CWebSocket : null,
	    'version'      : websocket_version
	};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3).version;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = {"_args":[[{"raw":"websocket","scope":null,"escapedName":"websocket","name":"websocket","rawSpec":"","spec":"latest","type":"tag"},"/home/brice/Development/killbug/tag"]],"_from":"websocket@latest","_id":"websocket@1.0.24","_inCache":true,"_location":"/websocket","_nodeVersion":"7.3.0","_npmOperationalInternal":{"host":"packages-12-west.internal.npmjs.com","tmp":"tmp/websocket-1.0.24.tgz_1482977757939_0.1858439394272864"},"_npmUser":{"name":"theturtle32","email":"brian@worlize.com"},"_npmVersion":"3.10.10","_phantomChildren":{},"_requested":{"raw":"websocket","scope":null,"escapedName":"websocket","name":"websocket","rawSpec":"","spec":"latest","type":"tag"},"_requiredBy":["#USER"],"_resolved":"https://registry.npmjs.org/websocket/-/websocket-1.0.24.tgz","_shasum":"74903e75f2545b6b2e1de1425bc1c905917a1890","_shrinkwrap":null,"_spec":"websocket","_where":"/home/brice/Development/killbug/tag","author":{"name":"Brian McKelvey","email":"brian@worlize.com","url":"https://www.worlize.com/"},"browser":"lib/browser.js","bugs":{"url":"https://github.com/theturtle32/WebSocket-Node/issues"},"config":{"verbose":false},"contributors":[{"name":"Iñaki Baz Castillo","email":"ibc@aliax.net","url":"http://dev.sipdoc.net"}],"dependencies":{"debug":"^2.2.0","nan":"^2.3.3","typedarray-to-buffer":"^3.1.2","yaeti":"^0.0.6"},"description":"Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.","devDependencies":{"buffer-equal":"^1.0.0","faucet":"^0.0.1","gulp":"git+https://github.com/gulpjs/gulp.git#4.0","gulp-jshint":"^2.0.4","jshint":"^2.0.0","jshint-stylish":"^2.2.1","tape":"^4.0.1"},"directories":{"lib":"./lib"},"dist":{"shasum":"74903e75f2545b6b2e1de1425bc1c905917a1890","tarball":"https://registry.npmjs.org/websocket/-/websocket-1.0.24.tgz"},"engines":{"node":">=0.8.0"},"gitHead":"0e15f9445953927c39ce84a232cb7dd6e3adf12e","homepage":"https://github.com/theturtle32/WebSocket-Node","keywords":["websocket","websockets","socket","networking","comet","push","RFC-6455","realtime","server","client"],"license":"Apache-2.0","main":"index","maintainers":[{"name":"theturtle32","email":"brian@worlize.com"}],"name":"websocket","optionalDependencies":{},"readme":"ERROR: No README data found!","repository":{"type":"git","url":"git+https://github.com/theturtle32/WebSocket-Node.git"},"scripts":{"gulp":"gulp","install":"(node-gyp rebuild 2> builderror.log) || (exit 0)","test":"faucet test/unit"},"version":"1.0.24"}

/***/ })
/******/ ]);
//# sourceMappingURL=client.js.map
