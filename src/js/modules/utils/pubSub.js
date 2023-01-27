class PubSub {
  constructor() {
    this.subscribers = {};
  }

  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);

    return {
      unsubscribe: () => {
        this.subscribers[event] = this.subscribers[event].filter(fn => fn !== callback);
      },
    };
  }

  publish(event, data) {
    if (!this.subscribers[event]) return;
    this.subscribers[event].forEach(callback => callback(data));
  }
}

export default new PubSub();
