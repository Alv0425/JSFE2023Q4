// import eventEmitter from "../utils/event-emitter/event-emitter";
import eventEmitter from "../utils/event-emitter/event-emitter";
import chatPage from "../view/chat/chat-page";
import RoomView from "../view/chat/room/room-view";
import type { Message } from "./message";
import type { User } from "./user";
import { EventsMap } from "../utils/event-emitter/events";
// import { EventsMap } from "../utils/event-emitter/events";

class Room {
  private view: RoomView;

  private container = chatPage;

  private isOpened = false;

  private allMessages: Set<string> = new Set();

  private unreadMsgs: Set<string> = new Set();

  constructor(private user: User) {
    this.view = new RoomView(user.getUserInfo().login, user.getUserInfo().isLogined);
  }

  public updateStatus(): void {
    this.view.updateStatus(this.user.getStatus());
  }

  public addUnread(id: string): void {
    this.unreadMsgs.add(id);
    this.user.setNumOfUnread(this.unreadMsgs.size);
  }

  public getLogin(): string {
    return this.user.getUserInfo().login;
  }

  public updateLastMessageOnContact(text: string): void {
    this.user.updateLastMessageText(text);
  }

  public removeMessage(message: Message): void {
    if (this.unreadMsgs.has(message.getId())) {
      this.unreadMsgs.delete(message.getId());
      this.user.setNumOfUnread(this.unreadMsgs.size);
    }
    message.remove();
    this.allMessages.delete(message.getId());
    this.view.closeEditMode();
  }

  public getLastMessageId(): string | undefined {
    return [...this.allMessages.values()].pop();
  }

  public resetUnread(): void {
    this.unreadMsgs = new Set();
    this.user.setNumOfUnread(0);
  }

  public remove(): void {
    this.view.destroy();
    this.user.remove();
  }

  public switchToEditMode(message: Message | undefined): void {
    if (!message) {
      return;
    }
    this.view.toEditMode(message.getContent(), message.getId());
  }

  public open(): void {
    this.container.openConversation(this.view);
    this.view.updateStatus(this.user.getStatus());
    this.view.setOpened();
    this.isOpened = true;
  }

  public close(): void {
    this.view.getComponent().remove();
    this.isOpened = false;
    this.view.setClosed();
  }

  public markAllUnreadMessagesAsRead(): void {
    this.unreadMsgs.forEach((msgId) => {
      eventEmitter.emit(EventsMap.markMessagesAsRead, msgId);
    });
    this.view.hideLine();
  }

  public setStatus(status: boolean): void {
    this.view.updateStatus(status);
  }

  public addMessage(message: Message): void {
    this.view.appendMessage(message.getView());
    this.updateLastMessageOnContact(message.getContent());
    this.allMessages.add(message.getId());
    if (this.isOpened) {
      this.view.scrollToBottom();
    }
  }
}

export default Room;
