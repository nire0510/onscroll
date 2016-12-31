import { pubsub } from './pubsub';
import collection from './collection';
import Orchestrator from './orchestrator';

/**
 * Scroll callback function
 * @type {function}
 */
const scroll = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function (callback) { window.setTimeout(callback, 1000/60) };
/**
 * Current H & V scrolls position
 * @type {{left: number, top: number}}
 */
window.position = { left: -1, top: -1 };
/**
 * Scroll mode
 * @type {string}
 */
let mode = 'scroll'; // 'requestAnimationFrame'
/**
 * Indicates whether library already initialized
 * @type {boolean}
 */
let initialized = false;

/**
 * Main execution function
 * @type {function}
 */
function run() {
  // position hasn't changed (optimization):
  if (window.position.left === window.pageXOffset && window.position.top === window.pageYOffset) {
    // re-run:
    if (mode === 'requestAnimationFrame') {
      scroll(run);
    }
    return false;
  }

  window.position = { left: window.pageXOffset, top: window.pageYOffset };
  collection.data.forEach(o => {
    o.run();
  });

  // re-run:
  if (mode === 'requestAnimationFrame') {
    scroll(run);
  }
}

function init() {
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
  }
  else {
    window.scrollTo(window.scrollX, window.scrollX);
  }

  console.log('Orchestrator initialized');
  initialized = true;
}

pubsub.subscribe('collection:item-added', function () {
  if (!initialized) {
    init();
  }
});

// export default orchestrator:
module.exports = Orchestrator;
