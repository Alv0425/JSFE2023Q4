import "./chat-main.css";
import { div, input, ul } from "../../../utils/component/elements";
import Component from "../../../utils/component/component";
import type ContactView from "../contact/contact-view";
import type RoomView from "../room/room-view";
import eventEmitter from "../../../utils/event-emitter/event-emitter";
import { EventsMap } from "../../../utils/event-emitter/events";

class ChatMain extends Component {
  private contactsContainer: Component<HTMLElement>;

  private chatContainer: Component<HTMLElement>;

  private sideBar: Component<HTMLElement>;

  private filter: Component<HTMLInputElement>;

  private placeholder: Component<HTMLElement>;

  constructor() {
    super("main", ["chat__main"], {}, {});
    this.sideBar = div(["chat__main-sidebar"]);
    this.filter = input(["chat__main-contacts-filter"], { type: "text", value: "" });
    this.filter.addListener("keyup", () =>
      eventEmitter.emit(EventsMap.contactsFilter, this.filter.getComponent().value),
    );
    this.contactsContainer = ul(["chat__main-contacts"]);
    this.sideBar.appendContent([this.filter, this.contactsContainer]);
    this.chatContainer = div(["chat__main-chat"]);
    this.appendContent([this.sideBar, this.chatContainer]);
    this.placeholder = div(["chat__main-chat-placeholder"]);
    this.placeholder.setTextContent("Select user to start chat!");
    this.chatContainer.append(this.placeholder);
    this.sideBar.getComponent().classList.add("chat__main-sidebar_opened");
    eventEmitter.on(EventsMap.backRoomClicked, () =>
      this.sideBar.getComponent().classList.add("chat__main-sidebar_opened"),
    );
    eventEmitter.on(EventsMap.roomOpened, () =>
      this.sideBar.getComponent().classList.remove("chat__main-sidebar_opened"),
    );
  }

  public updateContactList(contactViews: ContactView[]): void {
    this.contactsContainer.clearContainer();
    this.contactsContainer.appendContent(contactViews);
  }

  public clearChatContainer(): void {
    // console.log("clear chat");
    this.chatContainer.clearContainer();
    this.chatContainer.append(this.placeholder);
  }

  public appendRoom(room: RoomView): void {
    this.chatContainer.clearContainer();
    this.chatContainer.append(room);
  }
}

const chatMain = new ChatMain();

export default chatMain;
