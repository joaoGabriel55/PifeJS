export default class PubSub {
  constructor() {
    this.subscribers = [];
  }

  subscribe(subscriber) {
    if (typeof subscriber !== "function") {
      throw new Error(`${typeof subscriber} is not a function`);
    }

    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber) {
    if (typeof subscriber !== "function") {
      throw new Error(`${typeof subscriber} is not a function`);
    }

    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  publish(payload) {
    this.subscribers.forEach(subscriber => subscriber(payload));
  }
}
