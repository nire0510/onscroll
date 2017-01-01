import _ from '../vendor/lodash.custom';
import collection from './collection';

const actions = ['setStyle', 'removeClass', 'addClass', 'callFunction'];

/**
 * Created by nirelbaz on 21/12/2016.
 */
class Orchestrator {
  constructor(options) {
    /**
     * Orchestrator unique ID
     * @type {string}
     */
    this.id = btoa(new Date().valueOf().toString());
    /**
     * Indicates whether orchestrator is enabled
     * @type {boolean}
     */
    this.enabled = false;
    /**
     * Indicates whether orchestrator passed validation successfully
     * @type {boolean}
     */
    this.valid = false;
    /**
     * DOM element(s)
     * @type {HTMLElement[]}
     */
    this.element = null;
    // extract additional properties from options:
    this.extractOptions(options)
  }

  /**
   * Disables orchestrator
   */
  disable() {
    this.enabled = false;
  }

  /**
   * Enables orchestrator
   */
  enable() {
    this.enabled = true;
  }

  /**
   * Extracts & validates options
   * @param {object} options Orchestrator options
   */
  extractOptions(options) {
    // check for common options:
    if (options.selector &&
      ((options.hasOwnProperty('top') && (Number.isInteger(options.top) || (typeof options.top === 'object' && options.top.from && Number.isInteger(options.top.from)))) ||
      (options.hasOwnProperty('left') && (Number.isInteger(options.left) || (typeof options.left === 'object' && options.left.from && Number.isInteger(options.left.from))))) &&
      (options.setStyle || options.addClass || options.removeClass || options.callFunction)
    ) {
      this.selector = options.selector;
      this.element = document.querySelectorAll(options.selector);
      this.style = [];
      this.actions = {};
      this.left = {
        from: options.hasOwnProperty('left') && Number.isInteger(options.left) ? options.left : options.hasOwnProperty('left') ? options.left.from : null,
        to: options.hasOwnProperty('left') && options.left.to || null
      };
      this.top = {
        from: options.hasOwnProperty('top') && Number.isInteger(options.top) ? options.top : options.hasOwnProperty('top') ? options.top.from : null,
        to: options.hasOwnProperty('top') && options.top.to || null
      };
      if (options.debounce) {
        this.run = _.debounce(this._run, Number.isInteger(options.debounce) ? options.debounce : 100);
      }
      else if (options.throttle) {
        this.run = _.throttle(this._run, Number.isInteger(options.throttle) ? options.throttle : 100);
      }
      else {
        this.run = this._run;
      }

      // now check actions object:
      actions.forEach(action => {
        if (options.hasOwnProperty(action)) {
          switch (action) {
            case 'removeClass':
            case 'addClass':
              if (typeof options[action] === 'string' || Array.isArray(options[action])) {
                if (typeof options[action] === 'string') {
                  this.actions[action] = [options[action]];
                }
              }
              else {
                console.warn(`Action ${action} of orchestrator ${this.id} is not valid`);
              }
              break;
            case 'setStyle':
              if (typeof options[action] === 'object' && Object.keys(options[action]).length > 0) {
                this.actions[action] = options[action];
                // store current style:
                this.getCurrentStyle();
              }
              else {
                console.warn(`Action ${action} of orchestrator ${this.id} is not valid`);
              }
              break;
            case 'callFunction':
              if (typeof options[action] === 'function') {
                this.actions[action] = options[action];
              }
              else {
                console.warn(`Action ${action} of orchestrator ${this.id} is not valid`);
              }
              break;
          }
        }
      });

      // validate that there is at least one action:
      if (Object.keys(this.actions).length > 0) {
        collection.add(this);
        this.enabled = true;
        this.valid = true;
      }
      else {
        console.warn(`Orchestrator ${this.id} has no valid actions`);
      }
    }
    else {
      console.warn(`Orchestrator ${this.id} is not valid`);
    }
  }

  /**
   * Stores element's current style for reset when scroll not in range
   */
  getCurrentStyle() {
    if (this.element && this.element.length > 0) {
      [...this.element].forEach((element, index) => {
        let style = window.getComputedStyle(element),
          current = this.style && this.style.length > index && this.style[index] || {};

        Object.keys(this.actions.setStyle).forEach(prop => {
          current[prop] = style.getPropertyValue(prop);
        });
        this.style.push(current);
      });
    }
  }

  _run() {
    let position = window.position;

    // continue only if orchestrator is enabled & valid:
    if (this.enabled && this.valid) {
      // if element is empty, find and cache it:
      if (!this.element || this.element.length === 0) {
        this.element = document.querySelectorAll(this.selector);
        this.getCurrentStyle();
      }
      // verify there's such element:
      if (this.element && this.element.length > 0) {
        // orchestrator is in range:
        if ((Number.isInteger(this.top.from) && position.top >= this.top.from && (position.top <= this.top.to || this.top.to === null)) ||
          (Number.isInteger(this.top.left) && position.left >= this.left.from && (position.left <= this.left.to || this.left.to === null))) {
          this._apply();
        }
        // orchestrator is out of range:
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
  _apply() {
    for (let action in this.actions) {
      if (this.actions.hasOwnProperty(action)) {
        switch (action) {
          case 'addClass':
          case 'removeClass':
            [...this.element].forEach(element => {
              this.actions[action].forEach(className => {
                if (action === 'addClass') {
                  element.classList.add(className);
                }
                else {
                  element.classList.remove(className);
                }
              });
            });
            break;
          case 'setStyle':
            for (let property in this.actions[action]) {
              if (this.actions[action].hasOwnProperty(property)) {
                [...this.element].forEach(element => {
                  element.style[property] = typeof this.actions[action][property] === 'function' ?
                    this.actions[action][property](position.left, position.top) :
                    this.actions[action][property];
                });
              }
            }
            break;
          case 'callFunction':
            this.actions[action](position.left, position.top);
            break;
        }
      }
    }
  }

  /**
   * Ceases some actions (setStyle, addClass & removeClass) when scroll is out of range
   * @private
   */
  _cease() {
    for (let action in this.actions) {
      if (this.actions.hasOwnProperty(action)) {
        switch (action) {
          case 'addClass':
          case 'removeClass':
            [...this.element].forEach(element => {
              this.actions[action].forEach(className => {
                if (action === 'addClass') {
                  element.classList.remove(className);
                }
                else {
                  element.classList.add(className);
                }
              });
            });
            break;
          case 'setStyle':
            for (let property in this.actions[action]) {
              if (this.actions[action].hasOwnProperty(property)) {
                [...this.element].forEach((element, index) => {
                  element.style[property] = this.style[index][property];
                });
              }
            }
            break;
        }
      }
    }
  }
}

export default Orchestrator;
