type HandlerType<T extends unknown[]> = (...params: T) => void;

class EventEmitter<T extends unknown[]> {
  protected eventList: Record<string, HandlerType<T>[]>;

  public constructor() {
    this.eventList = {};
  }

  public on(event: string, handler: HandlerType<T>): () => void {
    if (!this.eventList[event]) {
      this.eventList[event] = [];
    }
    this.eventList[event].push(handler);
    return () => this.off(event, handler);
  }

  public once(event: string, handler: HandlerType<T>): void {
    const remove = this.on(event, (...args: T) => {
      remove();
      handler(...args);
    });
  }

  public off(event: string, handler?: HandlerType<T>): void {
    if (handler) {
      this.eventList[event] = this.eventList[event].filter((cb) => handler !== cb);
    } else {
      this.eventList[event] = [];
    }
  }

  public emit(event: string, ...params: T): void {
    if (this.eventList[event]) {
      this.eventList[event].forEach((cb) => {
        cb(...params);
      });
    }
  }
}
const eventEmitter = new EventEmitter();

export default eventEmitter;
