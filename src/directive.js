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
    if (options.selector && options.timeline && typeof options.timeline === 'object') {
      this.selector = options.selector;
      this.element = document.querySelectorAll(options.selector);
      this.timeline = options.timeline;
      this.style = [];

      // validate and format timeline array:
      this.timeline.forEach(scene => {
        if (scene.actions && typeof scene.actions === 'object' &&
          (scene.top && (isFinite(scene.top) || (Array.isArray(scene.top) && scene.top.every(n => isFinite(n)))) ||
          (scene.left && (isFinite(scene.left) || (Array.isArray(scene.left) && scene.left.every(n => isFinite(n))))))) {
          scene.top = Array.isArray(scene.top) ? scene.top : [scene.top, null];
          scene.left = Array.isArray(scene.left) ? scene.left : [scene.left, null];

          // now check actions object:
          for (let action in scene.actions) {
            if (scene.actions.hasOwnProperty(action)) {
              switch (action) {
                case 'addClass':
                  if (typeof scene.actions[action] === 'string' || Array.isArray(scene.actions[action])) {
                    if (typeof scene.actions[action] === 'string') {
                      scene.actions.addClass = [scene.actions[action]];
                    }
                  }
                  else {
                    delete scene.actions[action];
                    console.warn(`Action ${action} of directive ${this.id} is not valid`);
                  }
                  break;
                case 'removeClass':
                  if (typeof scene.actions[action] === 'string' || Array.isArray(scene.actions[action])) {
                    if (typeof scene.actions[action] === 'string') {
                      scene.actions.removeClass = [scene.actions[action]];
                    }
                  }
                  else {
                    delete scene.actions[action];
                    console.warn(`Action ${action} of directive ${this.id} is not valid`);
                  }
                  break;
                case 'setStyle':
                  if (typeof scene.actions[action] !== 'object' || Object.keys(scene.actions[action]).length === 0) {
                    delete scene.actions[action];
                    console.warn(`Action ${action} of directive ${this.id} is not valid`);
                  }

                  // store current style:
                  this.getCurrentStyle(scene);
                  break;
                case 'callFunction':
                  if (typeof scene.method !== 'function') {
                    delete scene.actions[action];
                    console.warn(`Action ${action} of directive ${this.id} is not valid`);
                  }
                  break;
              }
            }

            if (Object.keys(scene.actions).length > 0) {
              this.enabled = true;
              this.valid = true;
            }
            else {
              console.warn(`Directive ${this.id} has no valid actions`);
            }
          }
        }
      });
    }
    else {
      console.warn(`Directive ${this.id} is not valid`);
    }
  }

  /**
   * Stores element's current style for reset when scroll not in range
   * @param {object} scene Timeline scene
   */
  getCurrentStyle(scene) {
    if (this.element && this.element.length > 0) {
      [...this.element].forEach((element, index) => {
        let style = window.getComputedStyle(element),
          current = this.style && this.style.length > index && this.style[index] || {};

        Object.keys(scene.actions.setStyle).forEach(prop => {
          current[prop] = style.getPropertyValue(prop);
        });
        this.style.push(current);
      });
    }
  }

  run(left, top) {
    let shouldGetStyle = false;

    // continue only if directive is enabled & valid:
    if (this.enabled && this.valid) {
      // if element is empty, find and cache it:
      if (!this.element || this.element.length === 0) {
        this.element = document.querySelectorAll(this.selector);
        shouldGetStyle = true;
      }
      // verify there's such element:
      if (this.element && this.element.length > 0) {
        this.timeline.forEach(scene => {
          if (shouldGetStyle) {
            // store current style:
            this.getCurrentStyle(scene);
          }
          // directive is in range:
          if ((top >= scene.top[0] && (top <= scene.top[1] || !scene.top[1])) ||
            (left >= scene.left[0] && (left <= scene.left[1] || !scene.left[1]))) {
            for (let action in scene.actions) {
              if (scene.actions.hasOwnProperty(action)) {
                switch (action) {
                  case 'addClass':
                  case 'removeClass':
                    [...this.element].forEach(element => {
                      scene.actions[action].forEach(className => {
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
                    for (let property in scene.actions[action]) {
                      if (scene.actions[action].hasOwnProperty(property)) {
                        [...this.element].forEach(element => {
                          element.style[property] = typeof scene.actions[action][property] === 'function' ?
                            scene.actions[action][property](left, top) :
                            scene.actions[action][property];
                        });
                      }
                    }
                    break;
                  case 'callFunction':
                    scene.actions[action](left, top);
                    break;
                }
              }
            }
          }
          // directive is out of range:
          else {
            for (let action in scene.actions) {
              if (scene.actions.hasOwnProperty(action)) {
                switch (action) {
                  case 'addClass':
                  case 'removeClass':
                    [...this.element].forEach(element => {
                      scene.actions[action].forEach(className => {
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
                    for (let property in scene.actions[action]) {
                      if (scene.actions[action].hasOwnProperty(property)) {
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
        });
        shouldGetStyle = false;
      }
    }
  }
}

export default Directive;
