import MessagesPull from "../services/messages-pull";
import contacts from "../services/contacts";
import eventEmitter from "../utils/event-emitter/event-emitter";
import { EventsMap } from "../utils/event-emitter/events";
import chatPage from "../view/chat/chat-page";
import type { IResponse } from "../models/response";
import Message from "../models/message";
import type Room from "../models/room";
import AuthController from "./auth-controller";

class ChatController {
  private chatView = chatPage;

  private currentRoom: Room | null = null;

  private lastOpenedRoom = "";

  constructor() {
    eventEmitter.on(EventsMap.contactsUpdated, () => this.renderContacts());
    eventEmitter.on<string>(EventsMap.contactClicked, (login) => this.openRoom(login));
    eventEmitter.on<IResponse>(EventsMap.messageSent, (data) => this.handleMessageSend(data));
    eventEmitter.on<IResponse>(EventsMap.messageDelivered, (data) => this.handleMessageSend(data));
    eventEmitter.on<IResponse>(EventsMap.messageEdit, (data) => this.handleMessageSend(data));
    eventEmitter.on<IResponse>(EventsMap.messageRead, (data) => this.handleMessageSend(data));
    eventEmitter.on(EventsMap.logout, () => {
      MessagesPull.clearDb();
      this.chatView.clearChatContainer();
    });
    eventEmitter.on(EventsMap.scrollMessagesContainer, () => this.setMessagesRead());
    eventEmitter.on(EventsMap.messageContainerClicked, () => this.setMessagesRead());
    eventEmitter.on<string>(EventsMap.editMessageClicked, (id) => {
      this.currentRoom?.switchToEditMode(MessagesPull.getMessage(id));
    });
    eventEmitter.on<IResponse>(EventsMap.messageDelete, (data) => this.handleMessageDelete(data));
    eventEmitter.on<string>(EventsMap.contactsFilter, (data) => contacts.filterByText(data));
    eventEmitter.on(EventsMap.closeConnection, () => {
      this.lastOpenedRoom = this.currentRoom?.getLogin() ?? "";
      MessagesPull.clearDb();
      this.chatView.clearChatContainer();
      contacts.clear();
    });
    eventEmitter.on<string>(EventsMap.emojiSelected, (emoji) => this.currentRoom?.addEmoji(emoji));
  }

  private renderContacts(): void {
    const users = Array.from(contacts.getUsers().values());
    const usersViews = users
      .sort((userA, userB) => {
        const statusA = userA.getStatus() ? 1 : 0;
        const statusB = userB.getStatus() ? 1 : 0;
        return statusB - statusA;
      })
      .map((user) => user.getView());
    this.chatView.updateContactList(usersViews);
    this.currentRoom?.updateStatus();
    if (this.lastOpenedRoom) {
      const login = this.lastOpenedRoom;
      setTimeout(() => this.openRoom(login), 1000);
      this.lastOpenedRoom = "";
    } else {
      eventEmitter.emit(EventsMap.backRoomClicked);
    }
  }

  private handleMessageDelete(data: IResponse): void {
    if (data.payload.message?.id) {
      MessagesPull.deleteMessage(data.payload.message.id);
    }
  }

  private openRoom(login: string): void {
    this.currentRoom?.close();
    const room = MessagesPull.getRoom(login);
    room?.open();
    eventEmitter.emit(EventsMap.roomOpened);
    this.currentRoom = room ?? null;
    if (!room) {
      eventEmitter.emit(EventsMap.backRoomClicked);
    }
    this.lastOpenedRoom = "";
  }

  private handleMessageSend(data: IResponse): void {
    if (data.payload.message) {
      const newMessage = new Message(data.payload.message);
      MessagesPull.addMessage(newMessage);
      if (newMessage.getSender() === AuthController.currentUserData.login) {
        this.setMessagesRead();
      }
    }
  }

  private setMessagesRead(): void {
    this.currentRoom?.markAllUnreadMessagesAsRead();
    this.currentRoom?.resetUnread();
  }
}

const chatController = (): ChatController => new ChatController();

export default chatController;
