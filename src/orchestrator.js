import Directive from './directive';
import directives from './directives';

const orchestrator = {
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

    // create directive
    let directive = new Directive(id, options);
    // add it to directives collection and return its id:
    if (directive.valid) {
      directives.push(directive);
      return directive.id;
    }
  },

  /**
   * Removes an existing directive or many directives from collection
   * @param {string} ids One or more directive unique ID to delete.
   * Leave blank to delete all directives.
   */
  remove(...ids) {
    // delete all:
    if (ids.length === 0) {
      directives.length = 0;
      return false;
    }

    // delete some by id:
    ids.forEach(id => {
      directives.slice(directives.findIndex(p => p.id === id), 1);
    });
  },

  /**
   * Disables a directive or many directives
   * @param {string} [ids] One or more directive unique ID to disable.
   * Leave blank to disable all directives.
   */
  disable(...ids) {
    directives
      .filter(p => ids.includes(p.id) || ids.length === 0)
      .forEach(p => {
        p.disable()
      });
  },

  /**
   * Enables a directive or many directives
   * @param {string} [ids] One or more directive unique ID to enable.
   * Leave blank to enable all directives.
   */
  enable(...ids) {
    directives
      .filter(p => ids.includes(p.id) || ids.length === 0)
      .forEach(p => {
        p.enable()
      });
  }
};

let position = [-1, -1],
  scroll = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function (callback) { window.setTimeout(callback, 1000/60) };

function run() {
  // position hasn't changed (optimization):
  if (position[0] === window.pageXOffset && position[1] === window.pageYOffset) {
    scroll(run);
    return false;
  }
  // store current scroll position:
  position = [window.pageXOffset, window.pageYOffset];
  // run each directive:
  directives.forEach(p => p.run(position[0], position[1]));
  // re-run:
  scroll(run);
}

run();

// export default orchestrator:
export default orchestrator;
