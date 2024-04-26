import Room from "../models/room";
import type Message from "../models/message";
import type User from "../models/user";
import AuthController from "../controllers/auth-controller";

class MessagesPull {
  private static messages: Map<string, Message> = new Map();

  private static rooms: Map<string, Room> = new Map();

  public static addMessage(message: Message): void {
    if (this.messages.has(message.getId())) {
      const messageToUpdate = this.messages.get(message.getId());
      messageToUpdate?.updateMessage(message);
      if (messageToUpdate) {
        const key = this.findRoom(messageToUpdate);
        const room = this.rooms.get(key);
        if (room) {
          this.updateLastMessageOnContact(room);
        }
      }
      return;
    }
    this.messages.set(message.getId(), message);
    this.linkToRoom(message);
  }

  private static linkToRoom(message: Message): void {
    const key = this.findRoom(message);
    const room = this.rooms.get(key);
    if (room) {
      room.addMessage(message);
      if (!message.getStatus()?.isReaded) {
        if (message.getSender() === key) {
          room.addUnread(message.getId());
        }
      }
    }
  }

  private static findRoom(message: Message): string {
    return message.getSender() === AuthController.currentUserData.login ? message.getReciever() : message.getSender();
  }

  public static createRooms(users: User[]): void {
    users.forEach((user) => {
      if (!this.rooms.has(user.getUserInfo().login)) {
        this.rooms.set(user.getUserInfo().login, new Room(user));
      } else {
        this.rooms.get(user.getUserInfo().login)?.setStatus(user.getStatus());
      }
    });
  }

  public static clearDb(): void {
    this.rooms.forEach((room) => room.remove());
    this.messages.forEach((msg) => msg.remove());
    this.rooms = new Map();
    this.messages = new Map();
    AuthController.setUserData("", "");
  }

  public static getRoom(login: string): Room | undefined {
    return this.rooms.get(login);
  }

  public static getMessage(id: string): Message | undefined {
    return this.messages.get(id);
  }

  public static deleteMessage(id: string): void {
    const message = this.messages.get(id);
    if (message) {
      const roomKey = this.findRoom(message);
      const room = this.rooms.get(roomKey);
      room?.removeMessage(message);
      if (room) {
        this.updateLastMessageOnContact(room);
      }
      this.messages.delete(id);
    }
  }

  public static updateLastMessageOnContact(room: Room): void {
    const lastMsgId = room?.getLastMessageId();
    if (!lastMsgId) {
      room?.updateLastMessageOnContact(" ");
    }
    if (lastMsgId) {
      const msg = this.messages.get(lastMsgId);
      room?.updateLastMessageOnContact(msg?.getContent() ?? "");
    }
  }
}

export default MessagesPull;
