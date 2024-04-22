import MessagesPull from "../services/messages-pull";
import contacts from "../services/contacts";
import eventEmitter from "../utils/event-emitter/event-emitter";
import { EventsMap } from "../utils/event-emitter/events";
import chatPage from "../view/chat/chat-page";
import type { IMessageResponse, IResponse } from "../models/response";
import { Message } from "../models/message";
import type Room from "../models/room";
import AuthController from "./auth-controller";

class ChatController {
  private chatView = chatPage;

  private currentRoom: Room | null = null;

  private lastOpenedRoom = "";

  private contacts = contacts;

  constructor() {
    eventEmitter.on(EventsMap.login, () => {});
    eventEmitter.on(EventsMap.contactsUpdated, () => this.renderContacts());
    eventEmitter.on(EventsMap.contactClicked, (login) => this.openRoom(login));
    eventEmitter.on(EventsMap.messageSent, (data) => this.handleMessageSend(data));
    eventEmitter.on(EventsMap.messageDelivered, (data) => this.handleMessageSend(data));
    eventEmitter.on(EventsMap.messageEdit, (data) => this.handleMessageSend(data));
    eventEmitter.on(EventsMap.messageRead, (data) => this.handleMessageSend(data));
    eventEmitter.on(EventsMap.logout, () => {
      MessagesPull.clearDb();
      this.chatView.clearChatContainer();
    });
    eventEmitter.on(EventsMap.scrollMessagesContainer, () => this.setMessagesRead());
    eventEmitter.on(EventsMap.messageContainerClicked, () => this.setMessagesRead());
    eventEmitter.on(EventsMap.editMessageClicked, (id) =>
      this.currentRoom?.switchToEditMode(MessagesPull.getMessage(id as string)),
    );
    eventEmitter.on(EventsMap.messageDelete, (data) => this.handleMessageDelete(data));
    eventEmitter.on(EventsMap.contactsFilter, (data) => {
      const text = data as string;
      contacts.filterByText(text);
    });
    eventEmitter.on(EventsMap.closeConnection, () => {
      this.lastOpenedRoom = this.currentRoom?.getLogin() ?? "";
      MessagesPull.clearDb();
      this.chatView.clearChatContainer();
      contacts.clear();
    });
  }

  private renderContacts(): void {
    const users = Array.from(contacts.getUsers().values());
    const usersViews = users
      .sort((userA, userB) => {
        const a = userA.getStatus() ? 1 : 0;
        const b = userB.getStatus() ? 1 : 0;
        return b - a;
      })
      .map((user) => user.getView());
    this.chatView.updateContactList(usersViews);
    this.currentRoom?.updateStatus();
    if (this.lastOpenedRoom) {
      const login = this.lastOpenedRoom;
      // console.log("contacts-updated",this.lastOpenedRoom);
      setTimeout(() => this.openRoom(login), 1000);
      this.lastOpenedRoom = "";
    }
  }

  private handleMessageDelete(data: unknown): void {
    const res = data as IResponse;
    if (res.payload.message?.id) {
      MessagesPull.deleteMessage(res.payload.message.id);
    }
  }

  private openRoom(login: unknown): void {
    this.currentRoom?.close();
    const room = MessagesPull.getRoom(login as string);
    room?.open();
    eventEmitter.emit(EventsMap.roomOpened);
    this.currentRoom = room ?? null;
    this.lastOpenedRoom = "";
  }

  private handleMessageSend(data: unknown): void {
    const res = data as IResponse;
    const newMessage = new Message(res.payload.message as IMessageResponse);
    MessagesPull.addMessage(newMessage);
    if (newMessage.getSender() === AuthController.currentUserData.login) {
      this.setMessagesRead();
    }
  }

  private setMessagesRead(): void {
    this.currentRoom?.markAllUnreadMessagesAsRead();
    this.currentRoom?.resetUnread();
  }
}

const chatController = (): ChatController => new ChatController();

export default chatController;
