import Component from "../../../utils/component/component";
import "./message.css";
import { button, div, pre, span, svgSprite } from "../../../utils/component/elements";
import type { IMessageStatus } from "../../../models/message";
import eventEmitter from "../../../utils/event-emitter/event-emitter";
import { EventsMap } from "../../../utils/event-emitter/events";

class MessageView extends Component {
  private isMine: boolean;

  public text: Component;

  private state: Component<HTMLElement>;

  private authorLabel: Component<HTMLElement>;

  private time: Component<HTMLElement>;

  private buttons: Component<HTMLElement>;

  private removeBtn: Component<HTMLButtonElement>;

  private editBtn: Component<HTMLButtonElement>;

  private edited: Component<HTMLElement>;

  constructor(
    private id: string,
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
    this.edited = span(["message__state-edited"], this.isEdited());
    this.buttons = div(["message__buttons"]);
    this.removeBtn = button(
      ["message__remove"],
      "",
      svgSprite("./assets/icons/xmark-solid.svg#xmark", "message__icon"),
    );
    this.removeBtn.addListener("click", () => eventEmitter.emit(EventsMap.removeMessageClicked, this.id));
    this.editBtn = button(["message__edit"], "", svgSprite("./assets/icons/pen-solid.svg#pen", "message__icon"));
    this.editBtn.addListener("click", () => eventEmitter.emit(EventsMap.editMessageClicked, this.id));
    this.buttons.appendContent([this.removeBtn, this.editBtn]);
    this.appendContent([
      div(["message__header"], this.authorLabel, this.time),
      this.text,
      div(["message__footer"], this.edited, this.state),
      this.buttons,
    ]);
  }

  private isEdited(): string {
    if (this.status?.isEdited ?? false) {
      return "edited";
    }
    return " ";
  }

  public currentStatus(): string {
    let status = "sent";
    if (!this.status) {
      return status;
    }
    if (this.status.isDelivered) {
      status = "delivered";
    }
    if (this.status.isReaded) {
      status = "readed";
    }
    return status;
  }

  public updateMessage(text: string, status: IMessageStatus | undefined): void {
    this.status = status;
    this.state.setTextContent(this.currentStatus());
    this.edited.setTextContent(this.isEdited());
    this.text.setTextContent(text);
  }

  public isReaded(): boolean {
    return this.status?.isReaded ?? false;
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
}

export default MessageView;
