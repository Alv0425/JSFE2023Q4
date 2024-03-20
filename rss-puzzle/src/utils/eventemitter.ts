type HandlerType = (...params: unknown[]) => void;

class EventEmitter {
  protected eventList: Record<string, HandlerType[]>;

  public constructor() {
    this.eventList = {};
  }

  public on(event: string, handler: HandlerType) {
    if (!this.eventList[event]) {
      this.eventList[event] = [];
    }
    this.eventList[event].push(handler);
    return () => this.off(event, handler);
  }

  public once(event: string, handler: HandlerType) {
    const remove = this.on(event, (...args) => {
      remove();
      handler.apply(this, args);
    });
  }

  public off(event: string, handler?: HandlerType) {
    if (handler) {
      this.eventList[event] = this.eventList[event].filter((cb) => handler !== cb);
    } else {
      this.eventList[event] = [];
    }
  }

  public emit(event: string, ...params: unknown[]) {
    if (this.eventList[event]) {
      this.eventList[event].forEach((cb) => {
        cb.call(this, params);
      });
    }
  }
}

const eventEmitter = new EventEmitter();

export default eventEmitter;
