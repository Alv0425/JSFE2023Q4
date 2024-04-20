import Component from "../../../utils/component/component";
import "./message.css";
import { div, pre, span } from "../../../utils/component/elements";
import type { IMessageStatus } from "../../../models/message";

class MessageView extends Component {
  private isMine: boolean;

  public text: Component;

  private state: Component<HTMLElement>;

  private authorLabel: Component<HTMLElement>;

  private time: Component<HTMLElement>;

  constructor(
    textMessage: string,
    time: Date,
    author: string,
    private status: IMessageStatus | undefined,
    isMine: boolean,
  ) {
    super("div", ["message"], {}, {});
    if (isMine) {
      this.setMine();
    }
    this.isMine = isMine;
    const authorText = isMine ? `${author} (you)` : author;
    this.authorLabel = span(["message__author"], authorText);
    this.time = span(["message__time"], time.toLocaleTimeString("en-US"));
    this.text = pre(["message__text"], textMessage);
    this.state = span(["message__state"], this.currentStatus());
    this.appendContent([
      div(["message__header"], this.authorLabel, this.time),
      this.text,
      div(["message__footer"], this.state),
    ]);
  }

  public currentStatus(): string {
    let status = "";
    if (!this.status) {
      return status;
    }
    if (this.status.isDelivered) {
      status = "delivered";
    }
    if (this.status.isReaded) {
      status = "readed";
    }
    if (this.status.isEdited) {
      status = "edited";
    }
    return status;
  }

  public updateMessage(text: string, status: IMessageStatus | undefined): void {
    this.status = status;
    this.text.setTextContent(text);
  }

  public isMineMessage(): boolean {
    return this.isMine;
  }

  public setMine(): void {
    this.getComponent().classList.add("message_mine");
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
