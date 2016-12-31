import { pubsub } from './pubsub';

/**
 * Created by nirelbaz on 30/12/2016.
 */
let collection = {
  data: [],
  add(item) {
    this.data.push(item);
    pubsub.publish('collection:item-added');
  }
};

export default collection;
