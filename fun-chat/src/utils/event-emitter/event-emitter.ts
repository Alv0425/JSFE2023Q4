import type { EventsMap, HandlerType } from "./events";

class EventEmitter<T extends unknown[]> {
  protected eventList: Record<EventsMap, HandlerType<T>[]>;

  public constructor() {
    this.eventList = {} as Record<EventsMap, HandlerType<T>[]>;
  }

  // public on(event: EventsMap, handler: HandlerType<T>): () => void {
  //   if (!this.eventList[event]) {
  //     this.eventList[event] = [];
  //   }
  //   this.eventList[event]?.push(handler);
  //   return () => this.off(event, handler);
  // }

  public on<Type>(event: EventsMap, handler: HandlerType<Type[]>): () => void {
    if (!this.eventList[event]) {
      this.eventList[event] = [];
    }
    this.eventList[event]?.push(handler as HandlerType<unknown[]>);
    return () => this.off(event, handler as HandlerType<unknown[]>);
  }

  public once<Type>(event: EventsMap, handler: HandlerType<Type[]>): void {
    const remove = this.on(event, (...args: Type[]) => {
      remove();
      handler(...args);
    });
  }

  public off(event: EventsMap, handler?: HandlerType<T>): void {
    if (handler) {
      this.eventList[event] = this.eventList[event].filter((cb) => handler !== cb);
    } else {
      this.eventList[event] = [];
    }
  }

  public emit(event: EventsMap, ...params: T): void {
    if (this.eventList[event]) {
      this.eventList[event].forEach((cb) => {
        cb(...params);
      });
    }
  }
}
const eventEmitter = new EventEmitter();

export default eventEmitter;
