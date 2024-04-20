import MessagesPull from "../services/messages-pull";
import contacts from "../services/contacts";
import eventEmitter from "../utils/event-emitter/event-emitter";
import { EventsMap } from "../utils/event-emitter/events";
import chatPage from "../view/chat/chat-page";
import type { IMessageResponse, IResponse } from "../models/response";
// import AuthController from "./auth-controller";
import { Message } from "../models/message";

class ChatController {
  private chatView = chatPage;

  private contacts = contacts;

  constructor() {
    eventEmitter.on(EventsMap.login, () => {});
    eventEmitter.on(EventsMap.contactsUpdated, () => {
      const usersViews = Array.from(contacts.getUsers().values()).map((user) => user.getView());
      this.chatView.updateContactList(usersViews);
    });
    eventEmitter.on(EventsMap.contactClicked, (login) => MessagesPull.getRoom(login as string)?.open());
    eventEmitter.on(EventsMap.messageSent, (data) => this.handleMessageSend(data));
    eventEmitter.on(EventsMap.logout, () => {
      MessagesPull.clearDb();
      this.chatView.clearChatContainer();
    });
  }

  private handleMessageSend(data: unknown): void {
    const res = data as IResponse;
    // const currentLogin = AuthController.currentUserData.login
    // const isMyMessage = res.payload.message?.from === currentLogin;
    // const isMessageForMe = res.payload.message?.to === currentLogin;
    // const isDelivered = res.payload.message?.status?.isDelivered ?? false;
    // const date = new Date(res.payload.message?.datetime as number);
    const newMessage = new Message(res.payload.message as IMessageResponse);
    MessagesPull.addMessage(newMessage);
    // console.log("message-added");
    // if (!isDelivered) {console.log('is not delivered', date)};
    // if (isMyMessage) {//

    // };
    // if (isMessageForMe) {console.log('message for me')};
    // if (isDelivered) {
    //   if (isMyMessage) {console.log('my message delivered')};
    //   if (isMessageForMe) {console.log('message for me delivered')};
    // }
  }
}

const chatController = (): ChatController => new ChatController();

export default chatController;
