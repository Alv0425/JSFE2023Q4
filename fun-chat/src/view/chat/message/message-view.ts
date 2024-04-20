import Component from "../../../utils/component/component";
import "./message.css";
import { span } from "../../../utils/component/elements";

class MessageView extends Component {
  public text: Component;

  constructor() {
    super("div", ["message"], {}, {});
    this.text = span(["message__text"], "");
  }

  public setText(str: string): void {
    this.text.setTextContent(str);
  }

  public setEdited(): void {
    this.getComponent().classList.add("message_edited");
  }

  public setSent(): void {
    this.getComponent().classList.add("message_sent");
  }

  public setDelivered(): void {
    this.getComponent().classList.add("message_delivered");
  }

  public setRead(): void {
    this.getComponent().classList.add("message_read");
  }
}

export default MessageView;
