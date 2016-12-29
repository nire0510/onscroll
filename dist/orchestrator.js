(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["orchestrator"] = factory();
	else
		root["orchestrator"] = factory();
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
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _directive = __webpack_require__(1);
	
	var _directive2 = _interopRequireDefault(_directive);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var orchestrator = {
	  /**
	   * Current
	   */
	  mode: 'scroll', // 'requestAnimationFrame' / 'scroll'
	
	  /**
	   * Indicates if orchestrator is currently active
	   * @type {boolean}
	   */
	  active: false,
	
	  /**
	   * Scroll callback function
	   * @type {function}
	   * @private
	   */
	  _scroll: window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
	    window.setTimeout(callback, 1000 / 60);
	  },
	
	  /**
	   * Current H&V scrolls position
	   * @type [{number}, {number}]
	   * @private
	   */
	  _position: [-1, -1],
	
	  /**
	   * Directives collection
	   * @type [{Directive}]
	   * @private
	   */
	  _collection: [],
	
	  /**
	   * Object initialization
	   * @private
	   */
	  _init: function _init() {
	    this._run = this._run.bind(this);
	    // this._collection = new Proxy(this._data, {
	    //   deleteProperty: (target, property) => {
	    //     delete target[property];
	    //     if (target.length === 0) {
	    //       this._stop();
	    //     }
	    //     return true;
	    //   },
	    //   set: (target, property, value, receiver) => {
	    //     target[property] = value;
	    //     if (target.length > 0) {
	    //       this._start();
	    //     }
	    //     return true;
	    //   }
	    // });
	  },
	
	
	  /**
	   * Starts to track scrolls and call directives
	   * @private
	   */
	  _start: function _start() {
	    // add event listener:
	    switch (this.mode) {
	      case 'scroll':
	        window.addEventListener('scroll', this._run);
	        break;
	      case 'requestAnimationFrame':
	        this._scroll.call(window, this._run);
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
	    // set active:
	    this.active = true;
	  },
	
	
	  /**
	   * Stops to track scrolls and call directives
	   * @private
	   */
	  _stop: function _stop() {
	    // remove event listener:
	    if (this.mode === 'scroll') {
	      window.removeEventListener('scroll', this._run);
	    }
	    // set inactive:
	    this.active = false;
	  },
	
	
	  /**
	   * Starts or stops orchestrator depends on how many directives are active
	   * @private
	   */
	  _update: function _update() {
	    // stop if there are no directives or all of them are disabled:
	    if (this._collection.length === 0 || this._collection.every(function (directive) {
	      return !directive.enabled;
	    })) {
	      this.active && this._stop();
	    } else {
	      !this.active && this._start();
	    }
	  },
	
	
	  /**
	   *
	   * @private
	   */
	  _run: function _run() {
	    var _this = this;
	
	    // position hasn't changed (optimization):
	    if (this._position[0] === window.pageXOffset && this._position[1] === window.pageYOffset) {
	      // re-run:
	      if (this.mode === 'requestAnimationFrame') {
	        this._scroll.call(window, this._run);
	      }
	      return false;
	    }
	
	    this._position = [window.pageXOffset, window.pageYOffset];
	    this._collection.forEach(function (p) {
	      return p.run(_this._position[0], _this._position[1]);
	    });
	
	    // re-run:
	    if (this.mode === 'requestAnimationFrame') {
	      this._scroll.call(window, this._run);
	    }
	  },
	
	  /**
	   * Adds a new directive to collection
	   * @param {string} [id] Directive unique ID
	   * @param {object} options Directive options
	   * @return {string} Directive ID if valid, undefined otherwise
	   */
	  add: function add(id, options) {
	    // validate arguments:
	    if (!((typeof id === 'undefined' ? 'undefined' : _typeof(id)) === 'object' || (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object')) {
	      console.warn('Orchestrator: wrong number or type of arguments');
	      return false;
	    }
	    // generate directive id if it's empty and move current id content to options:
	    else if (!options) {
	        options = id;
	        id = null;
	      } else {
	        this.remove(id);
	      }
	
	    // create directive
	    var directive = new _directive2.default(id, options);
	    // add it to collection, upte status and return its id:
	    if (directive.valid) {
	      this._collection.push(directive);
	      this._update();
	      return directive.id;
	    }
	  },
	
	
	  /**
	   * Removes an existing directive or many directives from collection
	   * @param {string} ids One or more directive unique ID to delete.
	   * Leave blank to delete all directives.
	   */
	  remove: function remove() {
	    var _this2 = this;
	
	    for (var _len = arguments.length, ids = Array(_len), _key = 0; _key < _len; _key++) {
	      ids[_key] = arguments[_key];
	    }
	
	    // delete all & update status:
	    if (ids.length === 0) {
	      this._collection.length = 0;
	      this._update();
	      return true;
	    }
	
	    // delete some by id & update status:
	    ids.forEach(function (id) {
	      var index = _this2._collection.findIndex(function (p) {
	        return p.id === id;
	      });
	      if (index >= 0) {
	        _this2._collection.splice(index, 1);
	        _this2._update();
	      }
	    });
	  },
	
	
	  /**
	   * Disables a directive or many directives
	   * @param {string} [ids] One or more directive unique ID to disable.
	   * Leave blank to disable all directives.
	   */
	  disable: function disable() {
	    var _this3 = this;
	
	    for (var _len2 = arguments.length, ids = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      ids[_key2] = arguments[_key2];
	    }
	
	    this._collection.filter(function (p) {
	      return ids.includes(p.id) || ids.length === 0;
	    }).forEach(function (p) {
	      p.disable();
	      _this3._update();
	    });
	  },
	
	
	  /**
	   * Enables a directive or many directives
	   * @param {string} [ids] One or more directive unique ID to enable.
	   * Leave blank to enable all directives.
	   */
	  enable: function enable() {
	    var _this4 = this;
	
	    for (var _len3 = arguments.length, ids = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	      ids[_key3] = arguments[_key3];
	    }
	
	    this._collection.filter(function (p) {
	      return ids.includes(p.id) || ids.length === 0;
	    }).forEach(function (p) {
	      p.enable();
	      _this4._update();
	    });
	  }
	};
	
	orchestrator._init();
	
	// export default orchestrator:
	exports.default = orchestrator;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Created by nirelbaz on 21/12/2016.
	 */
	var Directive = function () {
	  function Directive(id, options) {
	    _classCallCheck(this, Directive);
	
	    this.id = id || btoa(new Date().valueOf().toString());
	    this.enabled = false;
	    this.valid = false;
	    this.element = null;
	
	    this.extractOptions(options);
	  }
	
	  /**
	   * Disables directive
	   */
	
	
	  _createClass(Directive, [{
	    key: 'disable',
	    value: function disable() {
	      this.enabled = false;
	    }
	
	    /**
	     * Enables directive
	     */
	
	  }, {
	    key: 'enable',
	    value: function enable() {
	      this.enabled = true;
	    }
	
	    /**
	     * Extracts & validates options
	     * @param {object} options Directive options
	     */
	
	  }, {
	    key: 'extractOptions',
	    value: function extractOptions(options) {
	      var _this = this;
	
	      // check for common options:
	      if (options.selector && options.timeline && _typeof(options.timeline) === 'object') {
	        this.selector = options.selector;
	        this.element = document.querySelectorAll(options.selector);
	        this.timeline = options.timeline;
	        this.style = [];
	
	        // validate and format timeline array:
	        this.timeline.forEach(function (scene) {
	          if (scene.actions && _typeof(scene.actions) === 'object' && (scene.top && (isFinite(scene.top) || Array.isArray(scene.top) && scene.top.every(function (n) {
	            return isFinite(n);
	          })) || scene.left && (isFinite(scene.left) || Array.isArray(scene.left) && scene.left.every(function (n) {
	            return isFinite(n);
	          })))) {
	            scene.top = Array.isArray(scene.top) ? scene.top : [scene.top, null];
	            scene.left = Array.isArray(scene.left) ? scene.left : [scene.left, null];
	
	            // now check actions object:
	            for (var action in scene.actions) {
	              if (scene.actions.hasOwnProperty(action)) {
	                switch (action) {
	                  case 'addClass':
	                    if (typeof scene.actions[action] === 'string' || Array.isArray(scene.actions[action])) {
	                      if (typeof scene.actions[action] === 'string') {
	                        scene.actions.addClass = [scene.actions[action]];
	                      }
	                    } else {
	                      delete scene.actions[action];
	                      console.warn('Action ' + action + ' of directive ' + _this.id + ' is not valid');
	                    }
	                    break;
	                  case 'removeClass':
	                    if (typeof scene.actions[action] === 'string' || Array.isArray(scene.actions[action])) {
	                      if (typeof scene.actions[action] === 'string') {
	                        scene.actions.removeClass = [scene.actions[action]];
	                      }
	                    } else {
	                      delete scene.actions[action];
	                      console.warn('Action ' + action + ' of directive ' + _this.id + ' is not valid');
	                    }
	                    break;
	                  case 'setStyle':
	                    if (_typeof(scene.actions[action]) !== 'object' || Object.keys(scene.actions[action]).length === 0) {
	                      delete scene.actions[action];
	                      console.warn('Action ' + action + ' of directive ' + _this.id + ' is not valid');
	                    }
	
	                    // store current style:
	                    _this.getCurrentStyle(scene);
	                    break;
	                  case 'callFunction':
	                    if (typeof scene.method !== 'function') {
	                      delete scene.actions[action];
	                      console.warn('Action ' + action + ' of directive ' + _this.id + ' is not valid');
	                    }
	                    break;
	                }
	              }
	
	              if (Object.keys(scene.actions).length > 0) {
	                _this.enabled = true;
	                _this.valid = true;
	              } else {
	                console.warn('Directive ' + _this.id + ' has no valid actions');
	              }
	            }
	          }
	        });
	      } else {
	        console.warn('Directive ' + this.id + ' is not valid');
	      }
	    }
	
	    /**
	     * Stores element's current style for reset when scroll not in range
	     * @param {object} scene Timeline scene
	     */
	
	  }, {
	    key: 'getCurrentStyle',
	    value: function getCurrentStyle(scene) {
	      var _this2 = this;
	
	      if (this.element && this.element.length > 0) {
	        [].concat(_toConsumableArray(this.element)).forEach(function (element, index) {
	          var style = window.getComputedStyle(element),
	              current = _this2.style && _this2.style.length > index && _this2.style[index] || {};
	
	          Object.keys(scene.actions.setStyle).forEach(function (prop) {
	            current[prop] = style.getPropertyValue(prop);
	          });
	          _this2.style.push(current);
	        });
	      }
	    }
	  }, {
	    key: 'run',
	    value: function run(left, top) {
	      var _this3 = this;
	
	      var shouldGetStyle = false;
	
	      // continue only if directive is enabled & valid:
	      if (this.enabled && this.valid) {
	        // if element is empty, find and cache it:
	        if (!this.element || this.element.length === 0) {
	          this.element = document.querySelectorAll(this.selector);
	          shouldGetStyle = true;
	        }
	        // verify there's such element:
	        if (this.element && this.element.length > 0) {
	          this.timeline.forEach(function (scene) {
	            // directive is in range:
	            if (top >= scene.top[0] && (top <= scene.top[1] || !scene.top[1]) || left >= scene.left[0] && (left <= scene.left[1] || !scene.left[1])) {
	              var _loop = function _loop(action) {
	                if (scene.actions.hasOwnProperty(action)) {
	                  switch (action) {
	                    case 'addClass':
	                    case 'removeClass':
	                      [].concat(_toConsumableArray(_this3.element)).forEach(function (element) {
	                        scene.actions[action].forEach(function (className) {
	                          if (action === 'addClass') {
	                            element.classList.add(className);
	                          } else {
	                            element.classList.remove(className);
	                          }
	                        });
	                      });
	                      break;
	                    case 'setStyle':
	                      if (shouldGetStyle) {
	                        // store current style:
	                        _this3.getCurrentStyle(scene);
	                        shouldGetStyle = false;
	                      }
	
	                      var _loop2 = function _loop2(property) {
	                        if (scene.actions[action].hasOwnProperty(property)) {
	                          [].concat(_toConsumableArray(_this3.element)).forEach(function (element) {
	                            element.style[property] = typeof scene.actions[action][property] === 'function' ? scene.actions[action][property](left, top) : scene.actions[action][property];
	                          });
	                        }
	                      };
	
	                      for (var property in scene.actions[action]) {
	                        _loop2(property);
	                      }
	                      break;
	                    case 'callFunction':
	                      scene.actions[action](left, top);
	                      break;
	                  }
	                }
	              };
	
	              for (var action in scene.actions) {
	                _loop(action);
	              }
	            }
	            // directive is out of range:
	            else {
	                var _loop3 = function _loop3(action) {
	                  if (scene.actions.hasOwnProperty(action)) {
	                    switch (action) {
	                      case 'addClass':
	                      case 'removeClass':
	                        [].concat(_toConsumableArray(_this3.element)).forEach(function (element) {
	                          scene.actions[action].forEach(function (className) {
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
	                          if (scene.actions[action].hasOwnProperty(property)) {
	                            [].concat(_toConsumableArray(_this3.element)).forEach(function (element, index) {
	                              element.style[property] = _this3.style[index][property];
	                            });
	                          }
	                        };
	
	                        for (var property in scene.actions[action]) {
	                          _loop4(property);
	                        }
	                        break;
	                    }
	                  }
	                };
	
	                for (var action in scene.actions) {
	                  _loop3(action);
	                }
	              }
	          });
	        }
	      }
	    }
	  }]);
	
	  return Directive;
	}();
	
	exports.default = Directive;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=orchestrator.js.map