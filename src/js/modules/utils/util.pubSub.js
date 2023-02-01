class PubSub {
  #subscribers = {};

  subscribe(event, callback) {
    if (!this.#subscribers[event]) {
      this.#subscribers[event] = [];
    }
    this.#subscribers[event].push(callback);
    return {
      unsubscribe: () => {
        this.#subscribers[event] = this.#subscribers[event].filter(fn => fn !== callback);
        if (!this.#subscribers[event].length) delete this.#subscribers[event];
      },
    };
  }

  publish(event, data) {
    if (!this.#subscribers[event]) return;
    this.#subscribers[event].forEach(callback => callback(data));
  }
}

export default new PubSub();
