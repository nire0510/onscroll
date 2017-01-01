import { pubsub } from './pubsub';

/**
 * Created by nirelbaz on 30/12/2016.
 */
let collection = {
  data: [],

  add(item) {
    this.data.push(item);
    pubsub.publish('collection:changed');
  },

  size() {
    return this.data.length;
  },

  remove(id) {
    let index = this.data.findIndex(o => o.id === id);

    if (index >= 0) {
      this.data.splice(index, 1);
      pubsub.publish('collection:changed');
    }
  }
};

export default collection;
