import { User } from "../models/user";
import type { IResponse } from "../models/response";
import eventEmitter from "../utils/event-emitter/event-emitter";
import { EventsMap } from "../utils/event-emitter/events";
import storage from "./storage";
import MessagesPull from "./messages-pull";

class Contacts {
  private collection: Map<string, User> = new Map();

  private active: User[] = [];

  private inactive: User[] = [];

  constructor() {
    eventEmitter.on(EventsMap.getActiveUsers, (data) => {
      const res = data as IResponse;
      const users = res.payload.users?.map((user) => new User(user));
      if (users) {
        this.setActiveUsers(users);
      }
    });
    eventEmitter.on(EventsMap.getInactiveUsers, (data) => {
      const res = data as IResponse;
      const users = res.payload.users?.map((user) => new User(user));
      if (users) {
        this.setInactiveUsers(users);
      }
    });
    eventEmitter.on(EventsMap.getHistory, (data) => this.actualizeHistory(data as IResponse));
    eventEmitter.on(EventsMap.logout, () => this.clear());
  }

  public clear(): void {
    this.active = [];
    this.inactive = [];
    this.updateCollection();
  }

  private actualizeHistory(data: IResponse): void {
    const login = data.id?.replace(/^USER-HISTORY-/, "") || "";
    const messagesMap = data.payload.messages?.map((message) => message.id) ?? [];
    if (this.collection.has(login)) {
      this.collection.get(login)?.setHistoryIds(messagesMap);
      // console.log(messagesMap);
    }
  }

  public getUsers(): Map<string, User> {
    return this.collection;
  }

  private updateCollection(): void {
    this.collection = new Map([...this.active, ...this.inactive].map((user) => [user.getUserInfo().login, user]));
    this.collection.delete(storage.getLogin());
    eventEmitter.emit(EventsMap.contactsUpdated, this.collection);
    MessagesPull.createRooms([...this.active, ...this.inactive]);
  }

  public setActiveUsers(users: User[]): void {
    this.active = users;
    this.updateCollection();
  }

  public setInactiveUsers(users: User[]): void {
    this.inactive = users;
    this.updateCollection();
  }
}

const contacts = new Contacts();

export default contacts;
