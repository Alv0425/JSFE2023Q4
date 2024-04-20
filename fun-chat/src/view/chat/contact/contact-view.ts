import "./contact-view.css";
import { div, span } from "../../../utils/component/elements";
import Component from "../../../utils/component/component";
import generateColor from "../../../utils/color-generator";

class ContactView extends Component {
  private circle: Component<HTMLElement>;

  private unreadMessagesLabel: Component<HTMLElement>;

  private lastMessage: Component<HTMLElement>;

  constructor(login: string, unread: number, lastMessage: string, status: boolean) {
    super("li", ["chat__contact"], {}, {});
    this.circle = span(["chat__contact-circle"], login[0]?.toUpperCase());
    this.circle.setStyleAttribute("background-color", generateColor(login));
    this.unreadMessagesLabel = span(["chat__contact-label"]);
    this.setNumber(unread);
    this.lastMessage = span(["chat__contact-message"], "");
    if (status) {
      this.setActive();
    }
    this.appendContent([
      this.circle,
      div(["chat__contact-name-container"], span(["chat__contact-name"], `${login}`), this.lastMessage),
      this.unreadMessagesLabel,
    ]);
  }

  public setActive(): void {
    this.getComponent().classList.add("chat__contact-active");
  }

  public setInactive(): void {
    this.getComponent().classList.remove("chat__contact-active");
  }

  public setMessage(str: string): void {
    const text = str.length < 50 ? str : `${str.slice(0, 50)}...`;
    this.lastMessage.setTextContent(text);
  }

  public setNumber(num: number): void {
    this.unreadMessagesLabel.setTextContent(`${num}`);
    if (num) {
      this.getComponent().classList.add("chat__contact_show-unread");
    } else {
      this.getComponent().classList.remove("chat__contact_show-unread");
    }
  }
}

export default ContactView;
