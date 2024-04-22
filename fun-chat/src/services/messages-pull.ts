import Room from "../models/room";
import type { Message } from "../models/message";
import type { User } from "../models/user";
import AuthController from "../controllers/auth-controller";

class MessagesPull {
  private static messages: Map<string, Message> = new Map();

  private static rooms: Map<string, Room> = new Map();

  public static addMessage(message: Message): void {
    if (this.messages.has(message.getId())) {
      this.messages.get(message.getId())?.updateMessage(message);
      return;
    }
    this.messages.set(message.getId(), message);
    this.linkToRoom(message);
  }

  public static updateMessage(message: Message): void {
    if (this.messages.has(message.getId())) {
      this.messages.get(message.getId())?.updateMessage(message);
    }
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
    this.rooms = new Map();
    this.messages = new Map();
    AuthController.setUserData("", "");
  }

  public static getRooms(): Map<string, Room> {
    return this.rooms;
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
      this.rooms.get(roomKey)?.removeMessage(message);
      this.messages.delete(id);
    }
  }

  public static getMessagesByIds(ids: string[]): (Message | undefined)[] {
    return ids.map((id) => this.getMessage(id)).filter((message) => message);
  }
}

export default MessagesPull;
