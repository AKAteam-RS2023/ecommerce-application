type Callback = (data: string) => void;

class EventEmitter {
  public events: Record<string, Callback[]>;

  constructor() {
    this.events = {};
  }

  public emit(eventName: string, data: string): void {
    const event = this.events[eventName];
    if (event) {
      event.forEach((fn) => {
        fn.call(null, data);
      });
    }
  }

  public subscribe(eventName: string, fn: Callback): () => void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
    return (): void => {
      this.events[eventName] = this.events[eventName].filter((eventFn) => fn !== eventFn);
    };
  }
}

export default new EventEmitter();
