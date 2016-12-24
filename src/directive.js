/**
 * Created by nirelbaz on 21/12/2016.
 */
class Directive {
  constructor(id, options) {
    this.id = id || btoa(new Date().valueOf().toString());
    this.enabled = false;
    this.valid = false;
    this.element = null;

    this.extractOptions(options)
  }

  /**
   * Disables directive
   */
  disable() {
    this.enabled = false;
  }

  /**
   * Enables directive
   */
  enable() {
    this.enabled = true;
  }

  /**
   * Extracts & validates options
   * @param {object} options Directive options
   */
  extractOptions(options) {
    // check for common options:
    if (options.selector && options.actions && typeof options.actions === 'object' &&
      (options.top && (isFinite(options.top) || (Array.isArray(options.top) && options.top.every(n => isFinite(n)))) ||
      (options.left && (isFinite(options.left) || (Array.isArray(options.left) && options.left.every(n => isFinite(n))))))) {
      this.selector = options.selector;
      this.element = document.querySelectorAll(options.selector);
      this.top = Array.isArray(options.top) ? options.top : [options.top, null];
      this.left = Array.isArray(options.left) ? options.left : [options.left, null];
      this.actions = options.actions;

      // now check actions object:
      for (let action in this.actions) {
        if (this.actions.hasOwnProperty(action)) {
          switch (action) {
            case 'addClass':
              if (typeof this.actions[action] === 'string' || Array.isArray(this.actions[action])) {
                if (typeof this.actions[action] === 'string') {
                  this.actions.addClass = [this.actions[action]];
                }
              }
              else {
                delete this.actions[action];
                console.warn(`Action ${action} of directive ${this.id} is not valid`);
              }
              break;
            case 'removeClass':
              if (typeof this.actions[action] === 'string' || Array.isArray(this.actions[action])) {
                if (typeof this.actions[action] === 'string') {
                  this.actions.removeClass = [this.actions[action]];
                }
              }
              else {
                delete this.actions[action];
                console.warn(`Action ${action} of directive ${this.id} is not valid`);
              }
              break;
            case 'setStyle':
              if (typeof this.actions[action] !== 'object' || Object.keys(this.actions[action]).length === 0) {
                delete this.actions[action];
                console.warn(`Action ${action} of directive ${this.id} is not valid`);
              }
              break;
            case 'callFunction':
              if (typeof this.method !== 'function') {
                delete this.actions[action];
                console.warn(`Action ${action} of directive ${this.id} is not valid`);
              }
              break;
          }
        }

        if (Object.keys(this.actions).length > 0) {
          this.enabled = true;
          this.valid = true;
        }
        else {
          console.warn(`Directive ${this.id} has no valid actions`);
        }
      }
    }
    else {
      console.warn(`Directive ${this.id} is not valid`);
    }
  }

  run(left, top) {
    // continue only if directive is enabled & valid:
    if (this.enabled && this.valid) {
      // if element is empty, find and cache it:
      if (!this.element) {
        this.element = document.querySelectorAll(this.selector);
      }
      // verify there's such element:
      if (this.element) {
        // directive is in range:
        if ((top >= this.top[0] && (top <= this.top[1] || !this.top[1])) ||
          (left >= this.left[0] && (left <= this.left[1] || !this.left[1]))) {
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
                          this.actions[action][property](left, top) :
                          this.actions[action][property];
                      });
                    }
                  }
                  break;
                case 'callFunction':
                  this.actions[action](left, top);
                  break;
              }
            }
          }
        }
        // directive is out of range:
        else {
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
              }
            }
          }
        }
      }
    }
  }
}

export default Directive;
