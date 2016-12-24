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
	
	var _directives = __webpack_require__(2);
	
	var _directives2 = _interopRequireDefault(_directives);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var orchestrator = {
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
	      }
	
	    // create directive
	    var directive = new _directive2.default(id, options);
	    // add it to directives collection and return its id:
	    if (directive.valid) {
	      _directives2.default.push(directive);
	      return directive.id;
	    }
	  },
	
	
	  /**
	   * Removes an existing directive or many directives from collection
	   * @param {string} ids One or more directive unique ID to delete.
	   * Leave blank to delete all directives.
	   */
	  remove: function remove() {
	    for (var _len = arguments.length, ids = Array(_len), _key = 0; _key < _len; _key++) {
	      ids[_key] = arguments[_key];
	    }
	
	    // delete all:
	    if (ids.length === 0) {
	      _directives2.default.length = 0;
	      return false;
	    }
	
	    // delete some by id:
	    ids.forEach(function (id) {
	      _directives2.default.slice(_directives2.default.findIndex(function (p) {
	        return p.id === id;
	      }), 1);
	    });
	  },
	
	
	  /**
	   * Disables a directive or many directives
	   * @param {string} [ids] One or more directive unique ID to disable.
	   * Leave blank to disable all directives.
	   */
	  disable: function disable() {
	    for (var _len2 = arguments.length, ids = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      ids[_key2] = arguments[_key2];
	    }
	
	    _directives2.default.filter(function (p) {
	      return ids.includes(p.id) || ids.length === 0;
	    }).forEach(function (p) {
	      p.disable();
	    });
	  },
	
	
	  /**
	   * Enables a directive or many directives
	   * @param {string} [ids] One or more directive unique ID to enable.
	   * Leave blank to enable all directives.
	   */
	  enable: function enable() {
	    for (var _len3 = arguments.length, ids = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	      ids[_key3] = arguments[_key3];
	    }
	
	    _directives2.default.filter(function (p) {
	      return ids.includes(p.id) || ids.length === 0;
	    }).forEach(function (p) {
	      p.enable();
	    });
	  }
	};
	
	var position = [-1, -1],
	    scroll = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
	  window.setTimeout(callback, 1000 / 60);
	};
	
	function run() {
	  // position hasn't changed (optimization):
	  if (position[0] === window.pageXOffset && position[1] === window.pageYOffset) {
	    scroll(run);
	    return false;
	  }
	  // store current scroll position:
	  position = [window.pageXOffset, window.pageYOffset];
	  // run each directive:
	  _directives2.default.forEach(function (p) {
	    return p.run(position[0], position[1]);
	  });
	  // re-run:
	  scroll(run);
	}
	
	run();
	
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
	      // check for common options:
	      if (options.selector && options.actions && _typeof(options.actions) === 'object' && (options.top && (isFinite(options.top) || Array.isArray(options.top) && options.top.every(function (n) {
	        return isFinite(n);
	      })) || options.left && (isFinite(options.left) || Array.isArray(options.left) && options.left.every(function (n) {
	        return isFinite(n);
	      })))) {
	        this.selector = options.selector;
	        this.element = document.querySelectorAll(options.selector);
	        this.top = Array.isArray(options.top) ? options.top : [options.top, null];
	        this.left = Array.isArray(options.left) ? options.left : [options.left, null];
	        this.actions = options.actions;
	
	        // now check actions object:
	        for (var action in this.actions) {
	          if (this.actions.hasOwnProperty(action)) {
	            switch (action) {
	              case 'addClass':
	                if (typeof this.actions[action] === 'string' || Array.isArray(this.actions[action])) {
	                  if (typeof this.actions[action] === 'string') {
	                    this.actions.addClass = [this.actions[action]];
	                  }
	                } else {
	                  delete this.actions[action];
	                  console.warn('Action ' + action + ' of directive ' + this.id + ' is not valid');
	                }
	                break;
	              case 'removeClass':
	                if (typeof this.actions[action] === 'string' || Array.isArray(this.actions[action])) {
	                  if (typeof this.actions[action] === 'string') {
	                    this.actions.removeClass = [this.actions[action]];
	                  }
	                } else {
	                  delete this.actions[action];
	                  console.warn('Action ' + action + ' of directive ' + this.id + ' is not valid');
	                }
	                break;
	              case 'setStyle':
	                if (_typeof(this.actions[action]) !== 'object' || Object.keys(this.actions[action]).length === 0) {
	                  delete this.actions[action];
	                  console.warn('Action ' + action + ' of directive ' + this.id + ' is not valid');
	                }
	                break;
	              case 'callFunction':
	                if (typeof this.method !== 'function') {
	                  delete this.actions[action];
	                  console.warn('Action ' + action + ' of directive ' + this.id + ' is not valid');
	                }
	                break;
	            }
	          }
	
	          if (Object.keys(this.actions).length > 0) {
	            this.enabled = true;
	            this.valid = true;
	          } else {
	            console.warn('Directive ' + this.id + ' has no valid actions');
	          }
	        }
	      } else {
	        console.warn('Directive ' + this.id + ' is not valid');
	      }
	    }
	  }, {
	    key: 'run',
	    value: function run(left, top) {
	      var _this = this;
	
	      // continue only if directive is enabled & valid:
	      if (this.enabled && this.valid) {
	        // if element is empty, find and cache it:
	        if (!this.element) {
	          this.element = document.querySelectorAll(this.selector);
	        }
	        // verify there's such element:
	        if (this.element) {
	          // directive is in range:
	          if (top >= this.top[0] && (top <= this.top[1] || !this.top[1]) || left >= this.left[0] && (left <= this.left[1] || !this.left[1])) {
	            var _loop = function _loop(action) {
	              if (_this.actions.hasOwnProperty(action)) {
	                switch (action) {
	                  case 'addClass':
	                  case 'removeClass':
	                    [].concat(_toConsumableArray(_this.element)).forEach(function (element) {
	                      _this.actions[action].forEach(function (className) {
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
	                      if (_this.actions[action].hasOwnProperty(property)) {
	                        [].concat(_toConsumableArray(_this.element)).forEach(function (element) {
	                          element.style[property] = typeof _this.actions[action][property] === 'function' ? _this.actions[action][property](left, top) : _this.actions[action][property];
	                        });
	                      }
	                    };
	
	                    for (var property in _this.actions[action]) {
	                      _loop2(property);
	                    }
	                    break;
	                  case 'callFunction':
	                    _this.actions[action](left, top);
	                    break;
	                }
	              }
	            };
	
	            for (var action in this.actions) {
	              _loop(action);
	            }
	          }
	          // directive is out of range:
	          else {
	              var _loop3 = function _loop3(action) {
	                if (_this.actions.hasOwnProperty(action)) {
	                  switch (action) {
	                    case 'addClass':
	                    case 'removeClass':
	                      [].concat(_toConsumableArray(_this.element)).forEach(function (element) {
	                        _this.actions[action].forEach(function (className) {
	                          if (action === 'addClass') {
	                            element.classList.remove(className);
	                          } else {
	                            element.classList.add(className);
	                          }
	                        });
	                      });
	                      break;
	                  }
	                }
	              };
	
	              for (var action in this.actions) {
	                _loop3(action);
	              }
	            }
	        }
	      }
	    }
	  }]);
	
	  return Directive;
	}();
	
	exports.default = Directive;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Created by nirelbaz on 21/12/2016.
	 */
	var directives = [];
	
	exports.default = directives;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=orchestrator.js.map