import "./chat-main.css";
import { div, ul } from "../../../utils/component/elements";
import Component from "../../../utils/component/component";
import type ContactView from "../contact/contact-view";
import RoomView from "../room/room-view";

class ChatMain extends Component {
  private contactsContainer: Component<HTMLElement>;

  private chatContainer: Component<HTMLElement>;

  constructor() {
    super("main", ["chat__main"], {}, {});
    this.contactsContainer = ul(["chat__main-contacts"]);
    this.chatContainer = div(["chat__main-chat"]);
    this.chatContainer.append(new RoomView("ddd", true));
    this.appendContent([this.contactsContainer, this.chatContainer]);
  }

  public updateContactList(contactViews: ContactView[]): void {
    this.contactsContainer.clearContainer();
    this.contactsContainer.appendContent(contactViews);
  }

  public appendRoom(room: RoomView): void {
    this.chatContainer.clearContainer();
    this.chatContainer.append(room);
  }
}

const chatMain = new ChatMain();

export default chatMain;
