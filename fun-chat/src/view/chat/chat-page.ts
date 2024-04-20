import "./chat.css";
import Component from "../../utils/component/component";
import chatFooter from "./chat-footer/chat-footer";
import chatHeader from "./chat-header/chat-header";
import chatMain from "./chat-main/chat-main";
import storage from "../../services/storage";
import eventEmitter from "../../utils/event-emitter/event-emitter";
import { EventsMap } from "../../utils/event-emitter/events";
import type ContactView from "./contact/contact-view";
import type RoomView from "./room/room-view";

class ChatPage extends Component {
  constructor() {
    super("div", ["chat"], {}, {}, chatHeader, chatMain, chatFooter);
    this.updateUI(storage.getLogin());
    eventEmitter.on(EventsMap.login, () => this.updateUI(storage.getLogin()));
  }

  public updateUI(login: string): void {
    chatHeader.updateUI(login);
  }

  public updateContactList(contacts: ContactView[]): void {
    chatMain.updateContactList(contacts);
  }

  public clearChatContainer(): void {
    chatMain.clearChatContainer();
  }

  public openConversation(room: RoomView): void {
    chatMain.appendRoom(room);
  }
}

const chatPage = new ChatPage();

export default chatPage;
