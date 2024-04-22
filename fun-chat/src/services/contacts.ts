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
    this.collection = new Map();
  }

  private actualizeHistory(data: IResponse): void {
    const login = data.id?.replace(/^USER-HISTORY-/, "") || "";
    const messagesMap = data.payload.messages?.map((message) => message.id) ?? [];
    if (this.collection.has(login)) {
      this.collection.get(login)?.setHistoryIds(messagesMap);
    }
  }

  public getUsers(): Map<string, User> {
    return this.collection;
  }

  private updateCollection(): void {
    [...this.inactive, ...this.active].forEach((user) => {
      if (this.collection.has(user.getUserInfo().login)) {
        this.collection.get(user.getUserInfo().login)?.updateUser(user);
      } else {
        this.collection.set(user.getUserInfo().login, user);
      }
    });
    // this.collection = new Map([...this.active, ...this.inactive].map((user) => [user.getUserInfo().login, user]));
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

  private showAll(): void {
    this.collection.forEach((user) => user.show());
  }

  public filterByText(str: string): void {
    const startsWith = str.trim().toLowerCase();
    this.showAll();
    if (startsWith === "") {
      return;
    }
    this.collection.forEach((user) => {
      if (!user.getUserInfo().login.toLowerCase().startsWith(startsWith)) {
        user.hide();
      }
    });
  }
}

const contacts = new Contacts();

export default contacts;
