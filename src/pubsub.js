/**
 * Created by nirelbaz on 31/12/2016.
 */
class PubSub {
  constructor() {
    this.handlers = [];
  }

  subscribe(event, handler, context) {
    if (typeof context === 'undefined') {
      context = handler;
    }

    this.handlers.push({event: event, handler: handler.bind(context)});
  }

  publish(event) {
    for (let i = 0; i < this.handlers.length; i++) {
      if (this.handlers[i].event === event) {
        this.handlers[i].handler.call();
      }
    }
  }
}

export let pubsub = new PubSub();
