import "./room.css";
import generateColor from "../../../utils/color-generator";
import { button, div, form, h2 } from "../../../utils/component/elements";
import Component from "../../../utils/component/component";
import type MessageView from "../message/message-view";
import eventEmitter from "../../../utils/event-emitter/event-emitter";
import { EventsMap } from "../../../utils/event-emitter/events";

class RoomView extends Component {
  private header: Component<HTMLElement>;

  private container: Component<HTMLElement>;

  private form: Component<HTMLElement>;

  private textField: Component<HTMLElement>;

  private sendButton: Component<HTMLButtonElement>;

  constructor(
    private login: string,
    private status: boolean,
  ) {
    super("div", ["room"], {}, {});
    const circle = div(["room__circle"]);
    circle.setTextContent(login[0]?.toUpperCase() || "");
    circle.setStyleAttribute("background-color", generateColor(login));
    this.header = div(["room__header"], circle, h2(["room__login"], login));
    this.container = div(["room__messages"]);
    this.form = form(["room__form"]);
    this.textField = new Component("textarea", ["room__text-container"]);
    this.sendButton = button(["room__send-button"], "Send");
    this.sendButton.getComponent().disabled = true;
    this.form.appendContent([this.textField, this.sendButton]);
    this.updateStatus(status);
    this.appendContent([this.header, this.container, this.form]);
    this.textField.addListener("keyup", () => this.checkText());
    this.textField.addListener("keypress", (evt) => {
      const event = evt as KeyboardEvent;
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        this.sendButton.getComponent().click();
      }
    });
    this.sendButton.addListener("click", () => this.sendMessage());
  }

  public updateStatus(status: boolean): void {
    if (status) {
      this.getComponent().classList.add("room_oneline");
    }
  }

  private checkText(): void {
    this.sendButton.getComponent().disabled = this.getTextContent().replace(/[\s]+/g, "") === "";
  }

  public getTextContent(): string {
    return (this.textField.getComponent() as HTMLTextAreaElement).value;
  }

  private clearField(): void {
    (this.textField.getComponent() as HTMLTextAreaElement).value = "";
  }

  private sendMessage(): void {
    eventEmitter.emit(EventsMap.sendMessageCkick, { login: this.login, text: this.getTextContent() });
    this.clearField();
  }

  public scrollToBottom(): void {
    const container = this.container.getComponent();
    container.scrollTop = container.scrollHeight;
  }

  public appendMessage(message: MessageView): void {
    this.container.append(message);
    if (message.isMineMessage()) {
      const container = this.container.getComponent();
      container.scrollTo({ behavior: "smooth", top: container.scrollHeight });
    }
  }
}

export default RoomView;
