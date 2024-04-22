import eventEmitter from "../utils/event-emitter/event-emitter";
import ContactView from "../view/chat/contact/contact-view";
import type { Message } from "./message";
import type { IUserResponse } from "./response";
import { EventsMap } from "../utils/event-emitter/events";

export interface IUser {
  id: string;
  login: string;
  isLoginned: false;
  password?: string;
}

export class User {
  public status: boolean | undefined;

  private login: string;

  private password: string | undefined;

  private view: ContactView;

  private messages: Message[] = [];

  private numOfUnreadMessages = 0;

  private messageIds: string[] = [];

  private unreadMsgs: Set<string> = new Set();

  private textLastMessage = "";

  constructor(params: IUserResponse, password?: string) {
    this.status = params.isLogined;
    this.login = params.login;
    this.password = password;
    this.view = new ContactView(this.login, this.numOfUnreadMessages, "", this.status || false);
    this.setNumOfUnread(0);
    this.view.addListener("click", () => eventEmitter.emit(EventsMap.contactClicked, this.login));
  }

  public remove(): void {
    this.view.destroy();
  }

  public updateUser(user: User): void {
    this.status = user.getStatus();
    if (this.status) {
      this.view.setActive();
    }
    if (!this.status) {
      this.view.setInactive();
    }
  }

  public updateLastMessageText(text: string): void {
    this.textLastMessage = text;
    this.view.setMessage(this.textLastMessage);
  }

  public setStatus(status: boolean): void {
    this.status = status;
  }

  public getView(): ContactView {
    return this.view;
  }

  public getStatus(): boolean {
    return this.status ?? false;
  }

  public setHistoryIds(messageIds: string[]): void {
    this.messageIds = messageIds;
  }

  public getHistoryIds(): string[] {
    return this.messageIds;
  }

  public setHistory(messages: Message[]): void {
    this.messages = messages;
  }

  public getHistory(): Message[] {
    return this.messages;
  }

  public setNumOfUnread(n: number): void {
    this.numOfUnreadMessages = n;
    this.view.setNumber(this.numOfUnreadMessages);
  }

  public getUserInfo(): {
    isLogined: boolean;
    login: string;
    messages: number;
  } {
    return {
      isLogined: this.status ?? false,
      login: this.login,
      messages: this.numOfUnreadMessages,
    };
  }

  public show(): void {
    this.view.show();
  }

  public hide(): void {
    this.view.hide();
  }
}
