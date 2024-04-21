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

  public resetUnread(): void {
    this.unreadMsgs = new Set();
    this.user.setNumOfUnread(0);
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
    if (this.isOpened) {
      this.view.scrollToBottom();
    }
  }
}

export default Room;
