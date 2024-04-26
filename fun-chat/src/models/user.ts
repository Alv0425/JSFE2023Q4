import ContactView from "../view/chat/contact/contact-view";
import type { IUserResponse } from "./response";

class User {
  public status: boolean | undefined;

  private login: string;

  private view: ContactView;

  private numOfUnreadMessages = 0;

  private textLastMessage = "";

  constructor(params: IUserResponse) {
    this.status = params.isLogined;
    this.login = params.login;
    this.view = new ContactView(this.login, this.numOfUnreadMessages, "", this.status || false);
    this.setNumOfUnread(0);
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

  public getView(): ContactView {
    return this.view;
  }

  public getStatus(): boolean {
    return this.status ?? false;
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

export default User;
