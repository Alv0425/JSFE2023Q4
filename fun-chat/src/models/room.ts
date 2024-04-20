// import eventEmitter from "../utils/event-emitter/event-emitter";
import chatPage from "../view/chat/chat-page";
import RoomView from "../view/chat/room/room-view";
import type { Message } from "./message";
import type { User } from "./user";
// import { EventsMap } from "../utils/event-emitter/events";

class Room {
  private view: RoomView;

  private container = chatPage;

  constructor(private user: User) {
    this.view = new RoomView(user.getUserInfo().login, user.getUserInfo().isLogined);
  }

  public open(): void {
    this.container.openConversation(this.view);
  }

  public setStatus(status: boolean): void {
    this.view.updateStatus(status);
  }

  public addMessage(message: Message): void {
    console.log("message-added");
    this.view.appendMessage(message.getView());
  }
}

export default Room;
