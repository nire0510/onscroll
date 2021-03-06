import _ from '../vendor/lodash.custom';
import collection from './collection';

const actions = ['setStyle', 'removeClass', 'addClass', 'callFunction'];

/**
 * Created by nirelbaz on 21/12/2016.
 */
class Onscroll {
  constructor(options) {
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
    this.extractOptions(options)
  }

  /**
   * Temporarily disables instance
   * @param {boolean} cease Indicates whether to cease all changes (works only for addClass, removeClass & setStyle)
   */
  disable(cease) {
    if (cease) {
      this._cease();
    }
    this.enabled = false;
  }

  /**
   * Enables instance
   */
  enable() {
    this.enabled = true;
  }

  /**
   * Permanently disables instance
   */
  remove() {
    collection.remove(this.id);
  }

  /**
   * Extracts & validates options
   * @param {object} options Instance options
   */
  extractOptions(options) {
    // check for common options:
    if (options.selector &&
      ((options.hasOwnProperty('top') && (Number.isFinite(options.top) || (typeof options.top === 'object' && options.top.hasOwnProperty('from') && Number.isFinite(options.top.from)))) ||
      (options.hasOwnProperty('left') && (Number.isFinite(options.left) || (typeof options.left === 'object' && options.left.hasOwnProperty('from') && Number.isFinite(options.left.from))))) &&
      (options.setStyle || options.addClass || options.removeClass || options.callFunction)
    ) {
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
      this.direction = typeof options.direction === 'string' ? [options.direction] :
        Array.isArray(options.direction) ? options.direction : [];
      if (options.hasOwnProperty('debounce')) {
        this.run = _.debounce(this._run, Number.isFinite(options.debounce) ? options.debounce : 100);
      }
      else if (options.hasOwnProperty('throttle')) {
        this.run = _.throttle(this._run, Number.isFinite(options.throttle) ? options.throttle : 100);
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
                else {
                  this.actions[action] = options[action];
                }
              }
              else {
                console.warn(`Action ${action} of instance ${this.id} is not valid`);
              }
              break;
            case 'setStyle':
              if (typeof options[action] === 'object' && Object.keys(options[action]).length > 0) {
                this.actions[action] = options[action];
                // store current style:
                this.getCurrentStyle();
              }
              else {
                console.warn(`Action ${action} of instance ${this.id} is not valid`);
              }
              break;
            case 'callFunction':
              if (typeof options[action] === 'function') {
                this.actions[action] = options[action];
              }
              else {
                console.warn(`Action ${action} of instance ${this.id} is not valid`);
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
        console.warn(`Onscroll ${this.id} has no valid actions`);
      }
    }
    else {
      console.warn(`Onscroll ${this.id} is not valid`);
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
    let position = window._onscroll.position;
    let direction = window._onscroll.direction;

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
        if (((Number.isFinite(this.top.from) && position.top >= this.top.from && (position.top <= this.top.to || this.top.to === null)) ||
          (Number.isFinite(this.top.left) && position.left >= this.left.from && (position.left <= this.left.to || this.left.to === null))) &&
          (this.direction.length === 0 || this.direction.some(d => d.split('-').every(d1 => direction[d1])))) {
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
                    this.actions[action][property](window._onscroll.position, window._onscroll.direction) :
                    this.actions[action][property];
                });
              }
            }
            break;
          case 'callFunction':
            this.actions[action](window._onscroll.position, window._onscroll.direction);
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

export default Onscroll;
