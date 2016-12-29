import Directive from './directive';

const orchestrator = {
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
  _scroll: window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) { window.setTimeout(callback, 1000/60) },

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
  _init() {
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
  _start() {
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
    }
    else {
      window.scrollTo(window.scrollX, window.scrollX);
    }
    // set active:
    this.active = true;
  },

  /**
   * Stops to track scrolls and call directives
   * @private
   */
  _stop() {
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
  _update() {
    // stop if there are no directives or all of them are disabled:
    if (this._collection.length === 0 || this._collection.every(directive => !directive.enabled)) {
      this.active && this._stop();
    }
    else {
      !this.active && this._start();
    }
  },

  /**
   *
   * @private
   */
  _run: function () {
    // position hasn't changed (optimization):
    if (this._position[0] === window.pageXOffset && this._position[1] === window.pageYOffset) {
      // re-run:
      if (this.mode === 'requestAnimationFrame') {
        this._scroll.call(window, this._run);
      }
      return false;
    }

    this._position = [window.pageXOffset, window.pageYOffset];
    this._collection.forEach(p => p.run(this._position[0], this._position[1]));

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
  add(id, options) {
    // validate arguments:
    if (!(typeof id === 'object' || typeof options === 'object')) {
      console.warn('Orchestrator: wrong number or type of arguments');
      return false;
    }
    // generate directive id if it's empty and move current id content to options:
    else if (!options) {
      options = id;
      id = null;
    }
    else {
      this.remove(id);
    }

    // create directive
    let directive = new Directive(id, options);
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
  remove(...ids) {
    // delete all & update status:
    if (ids.length === 0) {
      this._collection.length = 0;
      this._update();
      return true;
    }

    // delete some by id & update status:
    ids.forEach(id => {
      let index = this._collection.findIndex(p => p.id === id);
      if (index) {
        this._collection.splice(index, 1);
        this._update();
      }
    });
  },

  /**
   * Disables a directive or many directives
   * @param {string} [ids] One or more directive unique ID to disable.
   * Leave blank to disable all directives.
   */
  disable(...ids) {
    this._collection
      .filter(p => ids.includes(p.id) || ids.length === 0)
      .forEach(p => {
        p.disable();
        this._update();
      });
  },

  /**
   * Enables a directive or many directives
   * @param {string} [ids] One or more directive unique ID to enable.
   * Leave blank to enable all directives.
   */
  enable(...ids) {
    this._collection
      .filter(p => ids.includes(p.id) || ids.length === 0)
      .forEach(p => {
        p.enable();
        this._update();
      });
  }
};

orchestrator._init();

// export default orchestrator:
export default orchestrator;
