import eventEmitter from "../../../utils/event-emitter/event-emitter";
import Component from "../../../utils/component/component";
import { button, div, h1, h2 } from "../../../utils/component/elements";
import { EventsMap } from "../../../utils/event-emitter/events";
import generateColor from "../../../utils/helpers/color-generator";

class ChatHeader extends Component {
  public circle: Component<HTMLElement>;

  public username: Component<HTMLElement>;

  public infoButton: Component<HTMLButtonElement>;

  public logoutButton: Component<HTMLButtonElement>;

  constructor() {
    super("header", ["chat__header"], {}, {});
    this.circle = div(["chat__circle"]);
    this.username = h2(["chat__title-name"], "Username");
    this.infoButton = button(["chat__header-button"], "info");
    this.infoButton.addListener("click", () => eventEmitter.emit(EventsMap.aboutOpen));
    this.logoutButton = button(["chat__header-button"], "logout");
    this.logoutButton.addListener("click", () => eventEmitter.emit(EventsMap.loginOut));
    this.appendContent([
      this.circle,
      div(["chat__title"], h1(["chat__title-name"], "FUN CHAT"), this.username),
      div(["chat__header-buttons"], this.infoButton, this.logoutButton),
    ]);
  }

  public updateUI(login: string): void {
    this.circle.clear();
    this.circle.setTextContent((login[0] || "").toUpperCase());
    this.circle.setStyleAttribute("background-color", generateColor(login));
    this.username.setTextContent(login || "username");
  }
}

const chatHeader = new ChatHeader();

export default chatHeader;
