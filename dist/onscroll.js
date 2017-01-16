(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Onscroll"] = factory();
	else
		root["Onscroll"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _pubsub = __webpack_require__(1);
	
	var _collection = __webpack_require__(2);
	
	var _collection2 = _interopRequireDefault(_collection);
	
	var _onscroll = __webpack_require__(3);
	
	var _onscroll2 = _interopRequireDefault(_onscroll);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Scroll callback function
	 * @type {function}
	 */
	var scroll = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
	  window.setTimeout(callback, 1000 / 60);
	};
	/**
	 * Current H & V scrolls position
	 * @type {{left: number, top: number}}
	 */
	window.position = { left: -1, top: -1 };
	/**
	 * Scroll mode
	 * @type {string}
	 */
	var mode = 'scroll'; // 'requestAnimationFrame'
	/**
	 * Indicates whether library is up and running (has at least 1 instance)
	 * @type {boolean}
	 */
	var active = false;
	
	/**
	 * Main execution function
	 * @type {function}
	 */
	function run() {
	  if (active) {
	    // position hasn't changed (optimization):
	    if (window.position.left === window.pageXOffset && window.position.top === window.pageYOffset) {
	      // re-run:
	      if (mode === 'requestAnimationFrame') {
	        scroll(run);
	      }
	      return false;
	    }
	
	    window.position = { left: window.pageXOffset, top: window.pageYOffset };
	    _collection2.default.data.forEach(function (o) {
	      o.run();
	    });
	
	    // re-run:
	    if (mode === 'requestAnimationFrame') {
	      scroll(run);
	    }
	  }
	}
	
	_pubsub.pubsub.subscribe('collection:changed', function () {
	  // there is at least 1 instance:
	  if (_collection2.default.size() > 0) {
	    if (!active) {
	      // add event listener:
	      switch (mode) {
	        case 'scroll':
	          window.addEventListener('scroll', run);
	          break;
	        case 'requestAnimationFrame':
	          scroll(run);
	          break;
	      }
	
	      // trigger scroll event to apply directives for current positions:
	      if (document.readyState !== 'complete') {
	        window.addEventListener('load', function () {
	          window.scrollTo(window.scrollX, window.scrollX);
	        });
	      } else {
	        window.scrollTo(window.scrollX, window.scrollX);
	      }
	
	      console.log('Onscroll initialized');
	      active = true;
	    }
	  }
	  // no instances in collection:
	  else {
	      if (active) {
	        window.removeEventListener('scroll', run);
	        active = false;
	      }
	    }
	});
	
	// export default Onscroll:
	module.exports = _onscroll2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Created by nirelbaz on 31/12/2016.
	 */
	var PubSub = function () {
	  function PubSub() {
	    _classCallCheck(this, PubSub);
	
	    this.handlers = [];
	  }
	
	  _createClass(PubSub, [{
	    key: 'subscribe',
	    value: function subscribe(event, handler, context) {
	      if (typeof context === 'undefined') {
	        context = handler;
	      }
	
	      this.handlers.push({ event: event, handler: handler.bind(context) });
	    }
	  }, {
	    key: 'publish',
	    value: function publish(event) {
	      for (var i = 0; i < this.handlers.length; i++) {
	        if (this.handlers[i].event === event) {
	          this.handlers[i].handler.call();
	        }
	      }
	    }
	  }]);
	
	  return PubSub;
	}();
	
	var pubsub = exports.pubsub = new PubSub();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _pubsub = __webpack_require__(1);
	
	/**
	 * Created by nirelbaz on 30/12/2016.
	 */
	var collection = {
	  data: [],
	
	  add: function add(item) {
	    this.data.push(item);
	    _pubsub.pubsub.publish('collection:changed');
	  },
	  size: function size() {
	    return this.data.length;
	  },
	  remove: function remove(id) {
	    var index = this.data.findIndex(function (o) {
	      return o.id === id;
	    });
	
	    if (index >= 0) {
	      this.data.splice(index, 1);
	      _pubsub.pubsub.publish('collection:changed');
	    }
	  }
	};
	
	exports.default = collection;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _lodash = __webpack_require__(4);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _collection = __webpack_require__(2);
	
	var _collection2 = _interopRequireDefault(_collection);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var actions = ['setStyle', 'removeClass', 'addClass', 'callFunction'];
	
	/**
	 * Created by nirelbaz on 21/12/2016.
	 */
	
	var Onscroll = function () {
	  function Onscroll(options) {
	    _classCallCheck(this, Onscroll);
	
	    /**
	     * Instance unique ID
	     * @type {string}
	     */
	    this.id = btoa(new Date().valueOf().toString());
	    /**
	     * Indicates whether instance is enabled
	     * @type {boolean}
	     */
	    this.enabled = false;
	    /**
	     * Indicates whether instance passed validation successfully
	     * @type {boolean}
	     */
	    this.valid = false;
	    /**
	     * DOM element(s)
	     * @type {HTMLElement[]}
	     */
	    this.element = null;
	    // extract additional properties from options:
	    this.extractOptions(options);
	  }
	
	  /**
	   * Temporarily disables instance
	   * @param {boolean} cease Indicates whether to cease all changes (works only for addClass, removeClass & setStyle)
	   */
	
	
	  _createClass(Onscroll, [{
	    key: 'disable',
	    value: function disable(cease) {
	      if (cease) {
	        this._cease();
	      }
	      this.enabled = false;
	    }
	
	    /**
	     * Enables instance
	     */
	
	  }, {
	    key: 'enable',
	    value: function enable() {
	      this.enabled = true;
	    }
	
	    /**
	     * Permanently disables instance
	     */
	
	  }, {
	    key: 'remove',
	    value: function remove() {
	      _collection2.default.remove(this.id);
	    }
	
	    /**
	     * Extracts & validates options
	     * @param {object} options Instance options
	     */
	
	  }, {
	    key: 'extractOptions',
	    value: function extractOptions(options) {
	      var _this = this;
	
	      // check for common options:
	      if (options.selector && (options.hasOwnProperty('top') && (Number.isFinite(options.top) || _typeof(options.top) === 'object' && options.top.hasOwnProperty('from') && Number.isFinite(options.top.from)) || options.hasOwnProperty('left') && (Number.isFinite(options.left) || _typeof(options.left) === 'object' && options.left.hasOwnProperty('from') && Number.isFinite(options.left.from))) && (options.setStyle || options.addClass || options.removeClass || options.callFunction)) {
	        this.selector = options.selector;
	        this.element = document.querySelectorAll(options.selector);
	        this.style = [];
	        this.actions = {};
	        this.left = {
	          from: options.hasOwnProperty('left') && Number.isFinite(options.left) ? options.left : options.hasOwnProperty('left') ? options.left.from : null,
	          to: options.hasOwnProperty('left') && options.left.hasOwnProperty('to') && Number.isFinite(options.left.to) ? options.left.to : null
	        };
	        this.top = {
	          from: options.hasOwnProperty('top') && Number.isFinite(options.top) ? options.top : options.hasOwnProperty('top') ? options.top.from : null,
	          to: options.hasOwnProperty('top') && options.top.hasOwnProperty('to') && Number.isFinite(options.top.to) ? options.top.to : null
	        };
	        if (options.hasOwnProperty('debounce')) {
	          this.run = _lodash2.default.debounce(this._run, Number.isFinite(options.debounce) ? options.debounce : 100);
	        } else if (options.hasOwnProperty('throttle')) {
	          this.run = _lodash2.default.throttle(this._run, Number.isFinite(options.throttle) ? options.throttle : 100);
	        } else {
	          this.run = this._run;
	        }
	
	        // now check actions object:
	        actions.forEach(function (action) {
	          if (options.hasOwnProperty(action)) {
	            switch (action) {
	              case 'removeClass':
	              case 'addClass':
	                if (typeof options[action] === 'string' || Array.isArray(options[action])) {
	                  if (typeof options[action] === 'string') {
	                    _this.actions[action] = [options[action]];
	                  } else {
	                    _this.actions[action] = options[action];
	                  }
	                } else {
	                  console.warn('Action ' + action + ' of instance ' + _this.id + ' is not valid');
	                }
	                break;
	              case 'setStyle':
	                if (_typeof(options[action]) === 'object' && Object.keys(options[action]).length > 0) {
	                  _this.actions[action] = options[action];
	                  // store current style:
	                  _this.getCurrentStyle();
	                } else {
	                  console.warn('Action ' + action + ' of instance ' + _this.id + ' is not valid');
	                }
	                break;
	              case 'callFunction':
	                if (typeof options[action] === 'function') {
	                  _this.actions[action] = options[action];
	                } else {
	                  console.warn('Action ' + action + ' of instance ' + _this.id + ' is not valid');
	                }
	                break;
	            }
	          }
	        });
	
	        // validate that there is at least one action:
	        if (Object.keys(this.actions).length > 0) {
	          _collection2.default.add(this);
	          this.enabled = true;
	          this.valid = true;
	        } else {
	          console.warn('Onscroll ' + this.id + ' has no valid actions');
	        }
	      } else {
	        console.warn('Onscroll ' + this.id + ' is not valid');
	      }
	    }
	
	    /**
	     * Stores element's current style for reset when scroll not in range
	     */
	
	  }, {
	    key: 'getCurrentStyle',
	    value: function getCurrentStyle() {
	      var _this2 = this;
	
	      if (this.element && this.element.length > 0) {
	        [].concat(_toConsumableArray(this.element)).forEach(function (element, index) {
	          var style = window.getComputedStyle(element),
	              current = _this2.style && _this2.style.length > index && _this2.style[index] || {};
	
	          Object.keys(_this2.actions.setStyle).forEach(function (prop) {
	            current[prop] = style.getPropertyValue(prop);
	          });
	          _this2.style.push(current);
	        });
	      }
	    }
	  }, {
	    key: '_run',
	    value: function _run() {
	      var position = window.position;
	
	      // continue only if instance is enabled & valid:
	      if (this.enabled && this.valid) {
	        // if element is empty, find and cache it:
	        if (!this.element || this.element.length === 0) {
	          this.element = document.querySelectorAll(this.selector);
	          if (this.actions.hasOwnProperty('setStyle')) {
	            // store current style:
	            this.getCurrentStyle();
	          }
	        }
	        // verify there's such element:
	        if (this.element && this.element.length > 0) {
	          // instance is in range:
	          if (Number.isFinite(this.top.from) && position.top >= this.top.from && (position.top <= this.top.to || this.top.to === null) || Number.isFinite(this.top.left) && position.left >= this.left.from && (position.left <= this.left.to || this.left.to === null)) {
	            this._apply();
	          }
	          // instance is out of range:
	          else {
	              this._cease();
	            }
	        }
	      }
	    }
	
	    /**
	     * Applies all actions when scroll is in range
	     * @private
	     */
	
	  }, {
	    key: '_apply',
	    value: function _apply() {
	      var _this3 = this;
	
	      var _loop = function _loop(action) {
	        if (_this3.actions.hasOwnProperty(action)) {
	          switch (action) {
	            case 'addClass':
	            case 'removeClass':
	              [].concat(_toConsumableArray(_this3.element)).forEach(function (element) {
	                _this3.actions[action].forEach(function (className) {
	                  if (action === 'addClass') {
	                    element.classList.add(className);
	                  } else {
	                    element.classList.remove(className);
	                  }
	                });
	              });
	              break;
	            case 'setStyle':
	              var _loop2 = function _loop2(property) {
	                if (_this3.actions[action].hasOwnProperty(property)) {
	                  [].concat(_toConsumableArray(_this3.element)).forEach(function (element) {
	                    element.style[property] = typeof _this3.actions[action][property] === 'function' ? _this3.actions[action][property](position.left, position.top) : _this3.actions[action][property];
	                  });
	                }
	              };
	
	              for (var property in _this3.actions[action]) {
	                _loop2(property);
	              }
	              break;
	            case 'callFunction':
	              _this3.actions[action](position.left, position.top);
	              break;
	          }
	        }
	      };
	
	      for (var action in this.actions) {
	        _loop(action);
	      }
	    }
	
	    /**
	     * Ceases some actions (setStyle, addClass & removeClass) when scroll is out of range
	     * @private
	     */
	
	  }, {
	    key: '_cease',
	    value: function _cease() {
	      var _this4 = this;
	
	      var _loop3 = function _loop3(action) {
	        if (_this4.actions.hasOwnProperty(action)) {
	          switch (action) {
	            case 'addClass':
	            case 'removeClass':
	              [].concat(_toConsumableArray(_this4.element)).forEach(function (element) {
	                _this4.actions[action].forEach(function (className) {
	                  if (action === 'addClass') {
	                    element.classList.remove(className);
	                  } else {
	                    element.classList.add(className);
	                  }
	                });
	              });
	              break;
	            case 'setStyle':
	              var _loop4 = function _loop4(property) {
	                if (_this4.actions[action].hasOwnProperty(property)) {
	                  [].concat(_toConsumableArray(_this4.element)).forEach(function (element, index) {
	                    element.style[property] = _this4.style[index][property];
	                  });
	                }
	              };
	
	              for (var property in _this4.actions[action]) {
	                _loop4(property);
	              }
	              break;
	          }
	        }
	      };
	
	      for (var action in this.actions) {
	        _loop3(action);
	      }
	    }
	  }]);
	
	  return Onscroll;
	}();
	
	exports.default = Onscroll;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global, module) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * @license
	 * Lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash include="throttle,debounce"`
	 * Copyright JS Foundation and other contributors <https://js.foundation/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	;(function () {
	
	  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
	  var undefined;
	
	  /** Used as the semantic version number. */
	  var VERSION = '4.17.3';
	
	  /** Error message constants. */
	  var FUNC_ERROR_TEXT = 'Expected a function';
	
	  /** Used as references for various `Number` constants. */
	  var NAN = 0 / 0;
	
	  /** `Object#toString` result references. */
	  var nullTag = '[object Null]',
	      symbolTag = '[object Symbol]',
	      undefinedTag = '[object Undefined]';
	
	  /** Used to match leading and trailing whitespace. */
	  var reTrim = /^\s+|\s+$/g;
	
	  /** Used to detect bad signed hexadecimal string values. */
	  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
	
	  /** Used to detect binary string values. */
	  var reIsBinary = /^0b[01]+$/i;
	
	  /** Used to detect octal string values. */
	  var reIsOctal = /^0o[0-7]+$/i;
	
	  /** Built-in method references without a dependency on `root`. */
	  var freeParseInt = parseInt;
	
	  /** Detect free variable `global` from Node.js. */
	  var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;
	
	  /** Detect free variable `self`. */
	  var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;
	
	  /** Used as a reference to the global object. */
	  var root = freeGlobal || freeSelf || Function('return this')();
	
	  /** Detect free variable `exports`. */
	  var freeExports = ( false ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
	
	  /** Detect free variable `module`. */
	  var freeModule = freeExports && ( false ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;
	
	  /*--------------------------------------------------------------------------*/
	
	  /** Used for built-in method references. */
	  var objectProto = Object.prototype;
	
	  /** Used to check objects for own properties. */
	  var hasOwnProperty = objectProto.hasOwnProperty;
	
	  /**
	   * Used to resolve the
	   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	   * of values.
	   */
	  var nativeObjectToString = objectProto.toString;
	
	  /** Built-in value references. */
	  var _Symbol = root.Symbol,
	      symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;
	
	  /* Built-in method references for those with the same name as other `lodash` methods. */
	  var nativeMax = Math.max,
	      nativeMin = Math.min;
	
	  /** Used to lookup unminified function names. */
	  var realNames = {};
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * Creates a `lodash` object which wraps `value` to enable implicit method
	   * chain sequences. Methods that operate on and return arrays, collections,
	   * and functions can be chained together. Methods that retrieve a single value
	   * or may return a primitive value will automatically end the chain sequence
	   * and return the unwrapped value. Otherwise, the value must be unwrapped
	   * with `_#value`.
	   *
	   * Explicit chain sequences, which must be unwrapped with `_#value`, may be
	   * enabled using `_.chain`.
	   *
	   * The execution of chained methods is lazy, that is, it's deferred until
	   * `_#value` is implicitly or explicitly called.
	   *
	   * Lazy evaluation allows several methods to support shortcut fusion.
	   * Shortcut fusion is an optimization to merge iteratee calls; this avoids
	   * the creation of intermediate arrays and can greatly reduce the number of
	   * iteratee executions. Sections of a chain sequence qualify for shortcut
	   * fusion if the section is applied to an array and iteratees accept only
	   * one argument. The heuristic for whether a section qualifies for shortcut
	   * fusion is subject to change.
	   *
	   * Chaining is supported in custom builds as long as the `_#value` method is
	   * directly or indirectly included in the build.
	   *
	   * In addition to lodash methods, wrappers have `Array` and `String` methods.
	   *
	   * The wrapper `Array` methods are:
	   * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
	   *
	   * The wrapper `String` methods are:
	   * `replace` and `split`
	   *
	   * The wrapper methods that support shortcut fusion are:
	   * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
	   * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
	   * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
	   *
	   * The chainable wrapper methods are:
	   * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
	   * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
	   * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
	   * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
	   * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
	   * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
	   * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
	   * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
	   * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
	   * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
	   * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
	   * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
	   * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
	   * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
	   * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
	   * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
	   * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
	   * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
	   * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
	   * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
	   * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
	   * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
	   * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
	   * `zipObject`, `zipObjectDeep`, and `zipWith`
	   *
	   * The wrapper methods that are **not** chainable by default are:
	   * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
	   * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
	   * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
	   * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
	   * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
	   * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
	   * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
	   * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
	   * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
	   * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
	   * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
	   * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
	   * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
	   * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
	   * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
	   * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
	   * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
	   * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
	   * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
	   * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
	   * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
	   * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
	   * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
	   * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
	   * `upperFirst`, `value`, and `words`
	   *
	   * @name _
	   * @constructor
	   * @category Seq
	   * @param {*} value The value to wrap in a `lodash` instance.
	   * @returns {Object} Returns the new `lodash` wrapper instance.
	   * @example
	   *
	   * function square(n) {
	   *   return n * n;
	   * }
	   *
	   * var wrapped = _([1, 2, 3]);
	   *
	   * // Returns an unwrapped value.
	   * wrapped.reduce(_.add);
	   * // => 6
	   *
	   * // Returns a wrapped value.
	   * var squares = wrapped.map(square);
	   *
	   * _.isArray(squares);
	   * // => false
	   *
	   * _.isArray(squares.value());
	   * // => true
	   */
	  function lodash() {}
	  // No operation performed.
	
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * The base implementation of `getTag` without fallbacks for buggy environments.
	   *
	   * @private
	   * @param {*} value The value to query.
	   * @returns {string} Returns the `toStringTag`.
	   */
	  function baseGetTag(value) {
	    if (value == null) {
	      return value === undefined ? undefinedTag : nullTag;
	    }
	    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
	  }
	
	  /**
	   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	   *
	   * @private
	   * @param {*} value The value to query.
	   * @returns {string} Returns the raw `toStringTag`.
	   */
	  function getRawTag(value) {
	    var isOwn = hasOwnProperty.call(value, symToStringTag),
	        tag = value[symToStringTag];
	
	    try {
	      value[symToStringTag] = undefined;
	      var unmasked = true;
	    } catch (e) {}
	
	    var result = nativeObjectToString.call(value);
	    if (unmasked) {
	      if (isOwn) {
	        value[symToStringTag] = tag;
	      } else {
	        delete value[symToStringTag];
	      }
	    }
	    return result;
	  }
	
	  /**
	   * Converts `value` to a string using `Object.prototype.toString`.
	   *
	   * @private
	   * @param {*} value The value to convert.
	   * @returns {string} Returns the converted string.
	   */
	  function objectToString(value) {
	    return nativeObjectToString.call(value);
	  }
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * Gets the timestamp of the number of milliseconds that have elapsed since
	   * the Unix epoch (1 January 1970 00:00:00 UTC).
	   *
	   * @static
	   * @memberOf _
	   * @since 2.4.0
	   * @category Date
	   * @returns {number} Returns the timestamp.
	   * @example
	   *
	   * _.defer(function(stamp) {
	   *   console.log(_.now() - stamp);
	   * }, _.now());
	   * // => Logs the number of milliseconds it took for the deferred invocation.
	   */
	  var now = function now() {
	    return root.Date.now();
	  };
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * Creates a debounced function that delays invoking `func` until after `wait`
	   * milliseconds have elapsed since the last time the debounced function was
	   * invoked. The debounced function comes with a `cancel` method to cancel
	   * delayed `func` invocations and a `flush` method to immediately invoke them.
	   * Provide `options` to indicate whether `func` should be invoked on the
	   * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	   * with the last arguments provided to the debounced function. Subsequent
	   * calls to the debounced function return the result of the last `func`
	   * invocation.
	   *
	   * **Note:** If `leading` and `trailing` options are `true`, `func` is
	   * invoked on the trailing edge of the timeout only if the debounced function
	   * is invoked more than once during the `wait` timeout.
	   *
	   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	   * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	   *
	   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	   * for details over the differences between `_.debounce` and `_.throttle`.
	   *
	   * @static
	   * @memberOf _
	   * @since 0.1.0
	   * @category Function
	   * @param {Function} func The function to debounce.
	   * @param {number} [wait=0] The number of milliseconds to delay.
	   * @param {Object} [options={}] The options object.
	   * @param {boolean} [options.leading=false]
	   *  Specify invoking on the leading edge of the timeout.
	   * @param {number} [options.maxWait]
	   *  The maximum time `func` is allowed to be delayed before it's invoked.
	   * @param {boolean} [options.trailing=true]
	   *  Specify invoking on the trailing edge of the timeout.
	   * @returns {Function} Returns the new debounced function.
	   * @example
	   *
	   * // Avoid costly calculations while the window size is in flux.
	   * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	   *
	   * // Invoke `sendMail` when clicked, debouncing subsequent calls.
	   * jQuery(element).on('click', _.debounce(sendMail, 300, {
	   *   'leading': true,
	   *   'trailing': false
	   * }));
	   *
	   * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
	   * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	   * var source = new EventSource('/stream');
	   * jQuery(source).on('message', debounced);
	   *
	   * // Cancel the trailing debounced invocation.
	   * jQuery(window).on('popstate', debounced.cancel);
	   */
	  function debounce(func, wait, options) {
	    var lastArgs,
	        lastThis,
	        maxWait,
	        result,
	        timerId,
	        lastCallTime,
	        lastInvokeTime = 0,
	        leading = false,
	        maxing = false,
	        trailing = true;
	
	    if (typeof func != 'function') {
	      throw new TypeError(FUNC_ERROR_TEXT);
	    }
	    wait = toNumber(wait) || 0;
	    if (isObject(options)) {
	      leading = !!options.leading;
	      maxing = 'maxWait' in options;
	      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
	      trailing = 'trailing' in options ? !!options.trailing : trailing;
	    }
	
	    function invokeFunc(time) {
	      var args = lastArgs,
	          thisArg = lastThis;
	
	      lastArgs = lastThis = undefined;
	      lastInvokeTime = time;
	      result = func.apply(thisArg, args);
	      return result;
	    }
	
	    function leadingEdge(time) {
	      // Reset any `maxWait` timer.
	      lastInvokeTime = time;
	      // Start the timer for the trailing edge.
	      timerId = setTimeout(timerExpired, wait);
	      // Invoke the leading edge.
	      return leading ? invokeFunc(time) : result;
	    }
	
	    function remainingWait(time) {
	      var timeSinceLastCall = time - lastCallTime,
	          timeSinceLastInvoke = time - lastInvokeTime,
	          result = wait - timeSinceLastCall;
	
	      return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
	    }
	
	    function shouldInvoke(time) {
	      var timeSinceLastCall = time - lastCallTime,
	          timeSinceLastInvoke = time - lastInvokeTime;
	
	      // Either this is the first call, activity has stopped and we're at the
	      // trailing edge, the system time has gone backwards and we're treating
	      // it as the trailing edge, or we've hit the `maxWait` limit.
	      return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
	    }
	
	    function timerExpired() {
	      var time = now();
	      if (shouldInvoke(time)) {
	        return trailingEdge(time);
	      }
	      // Restart the timer.
	      timerId = setTimeout(timerExpired, remainingWait(time));
	    }
	
	    function trailingEdge(time) {
	      timerId = undefined;
	
	      // Only invoke if we have `lastArgs` which means `func` has been
	      // debounced at least once.
	      if (trailing && lastArgs) {
	        return invokeFunc(time);
	      }
	      lastArgs = lastThis = undefined;
	      return result;
	    }
	
	    function cancel() {
	      if (timerId !== undefined) {
	        clearTimeout(timerId);
	      }
	      lastInvokeTime = 0;
	      lastArgs = lastCallTime = lastThis = timerId = undefined;
	    }
	
	    function flush() {
	      return timerId === undefined ? result : trailingEdge(now());
	    }
	
	    function debounced() {
	      var time = now(),
	          isInvoking = shouldInvoke(time);
	
	      lastArgs = arguments;
	      lastThis = this;
	      lastCallTime = time;
	
	      if (isInvoking) {
	        if (timerId === undefined) {
	          return leadingEdge(lastCallTime);
	        }
	        if (maxing) {
	          // Handle invocations in a tight loop.
	          timerId = setTimeout(timerExpired, wait);
	          return invokeFunc(lastCallTime);
	        }
	      }
	      if (timerId === undefined) {
	        timerId = setTimeout(timerExpired, wait);
	      }
	      return result;
	    }
	    debounced.cancel = cancel;
	    debounced.flush = flush;
	    return debounced;
	  }
	
	  /**
	   * Creates a throttled function that only invokes `func` at most once per
	   * every `wait` milliseconds. The throttled function comes with a `cancel`
	   * method to cancel delayed `func` invocations and a `flush` method to
	   * immediately invoke them. Provide `options` to indicate whether `func`
	   * should be invoked on the leading and/or trailing edge of the `wait`
	   * timeout. The `func` is invoked with the last arguments provided to the
	   * throttled function. Subsequent calls to the throttled function return the
	   * result of the last `func` invocation.
	   *
	   * **Note:** If `leading` and `trailing` options are `true`, `func` is
	   * invoked on the trailing edge of the timeout only if the throttled function
	   * is invoked more than once during the `wait` timeout.
	   *
	   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	   * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	   *
	   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	   * for details over the differences between `_.throttle` and `_.debounce`.
	   *
	   * @static
	   * @memberOf _
	   * @since 0.1.0
	   * @category Function
	   * @param {Function} func The function to throttle.
	   * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
	   * @param {Object} [options={}] The options object.
	   * @param {boolean} [options.leading=true]
	   *  Specify invoking on the leading edge of the timeout.
	   * @param {boolean} [options.trailing=true]
	   *  Specify invoking on the trailing edge of the timeout.
	   * @returns {Function} Returns the new throttled function.
	   * @example
	   *
	   * // Avoid excessively updating the position while scrolling.
	   * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
	   *
	   * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
	   * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
	   * jQuery(element).on('click', throttled);
	   *
	   * // Cancel the trailing throttled invocation.
	   * jQuery(window).on('popstate', throttled.cancel);
	   */
	  function throttle(func, wait, options) {
	    var leading = true,
	        trailing = true;
	
	    if (typeof func != 'function') {
	      throw new TypeError(FUNC_ERROR_TEXT);
	    }
	    if (isObject(options)) {
	      leading = 'leading' in options ? !!options.leading : leading;
	      trailing = 'trailing' in options ? !!options.trailing : trailing;
	    }
	    return debounce(func, wait, {
	      'leading': leading,
	      'maxWait': wait,
	      'trailing': trailing
	    });
	  }
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * Checks if `value` is the
	   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	   *
	   * @static
	   * @memberOf _
	   * @since 0.1.0
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	   * @example
	   *
	   * _.isObject({});
	   * // => true
	   *
	   * _.isObject([1, 2, 3]);
	   * // => true
	   *
	   * _.isObject(_.noop);
	   * // => true
	   *
	   * _.isObject(null);
	   * // => false
	   */
	  function isObject(value) {
	    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	    return value != null && (type == 'object' || type == 'function');
	  }
	
	  /**
	   * Checks if `value` is object-like. A value is object-like if it's not `null`
	   * and has a `typeof` result of "object".
	   *
	   * @static
	   * @memberOf _
	   * @since 4.0.0
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	   * @example
	   *
	   * _.isObjectLike({});
	   * // => true
	   *
	   * _.isObjectLike([1, 2, 3]);
	   * // => true
	   *
	   * _.isObjectLike(_.noop);
	   * // => false
	   *
	   * _.isObjectLike(null);
	   * // => false
	   */
	  function isObjectLike(value) {
	    return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
	  }
	
	  /**
	   * Checks if `value` is classified as a `Symbol` primitive or object.
	   *
	   * @static
	   * @memberOf _
	   * @since 4.0.0
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	   * @example
	   *
	   * _.isSymbol(Symbol.iterator);
	   * // => true
	   *
	   * _.isSymbol('abc');
	   * // => false
	   */
	  function isSymbol(value) {
	    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
	  }
	
	  /**
	   * Converts `value` to a number.
	   *
	   * @static
	   * @memberOf _
	   * @since 4.0.0
	   * @category Lang
	   * @param {*} value The value to process.
	   * @returns {number} Returns the number.
	   * @example
	   *
	   * _.toNumber(3.2);
	   * // => 3.2
	   *
	   * _.toNumber(Number.MIN_VALUE);
	   * // => 5e-324
	   *
	   * _.toNumber(Infinity);
	   * // => Infinity
	   *
	   * _.toNumber('3.2');
	   * // => 3.2
	   */
	  function toNumber(value) {
	    if (typeof value == 'number') {
	      return value;
	    }
	    if (isSymbol(value)) {
	      return NAN;
	    }
	    if (isObject(value)) {
	      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	      value = isObject(other) ? other + '' : other;
	    }
	    if (typeof value != 'string') {
	      return value === 0 ? value : +value;
	    }
	    value = value.replace(reTrim, '');
	    var isBinary = reIsBinary.test(value);
	    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
	  }
	
	  /*------------------------------------------------------------------------*/
	
	  // Add methods that return wrapped values in chain sequences.
	  lodash.debounce = debounce;
	  lodash.throttle = throttle;
	
	  /*------------------------------------------------------------------------*/
	
	  // Add methods that return unwrapped values in chain sequences.
	  lodash.isObject = isObject;
	  lodash.isObjectLike = isObjectLike;
	  lodash.isSymbol = isSymbol;
	  lodash.now = now;
	  lodash.toNumber = toNumber;
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * The semantic version number.
	   *
	   * @static
	   * @memberOf _
	   * @type {string}
	   */
	  lodash.VERSION = VERSION;
	
	  /*--------------------------------------------------------------------------*/
	
	  // Some AMD build optimizers, like r.js, check for condition patterns like:
	  if ("function" == 'function' && _typeof(__webpack_require__(6)) == 'object' && __webpack_require__(6)) {
	    // Expose Lodash on the global object to prevent errors when Lodash is
	    // loaded by a script tag in the presence of an AMD loader.
	    // See http://requirejs.org/docs/errors.html#mismatch for more details.
	    // Use `_.noConflict` to remove Lodash from the global object.
	    root._ = lodash;
	
	    // Define as an anonymous module so, through path mapping, it can be
	    // referenced as the "underscore" module.
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return lodash;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  // Check for `exports` after `define` in case a build optimizer adds it.
	  else if (freeModule) {
	      // Export for Node.js.
	      (freeModule.exports = lodash)._ = lodash;
	      // Export for CommonJS support.
	      freeExports._ = lodash;
	    } else {
	      // Export to the global object.
	      root._ = lodash;
	    }
	}).call(undefined);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(5)(module)))

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }
/******/ ])
});
;
//# sourceMappingURL=onscroll.js.map