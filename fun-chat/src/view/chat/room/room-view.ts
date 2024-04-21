import "./room.css";
import { button, div, form } from "../../../utils/component/elements";
import Component from "../../../utils/component/component";
import type MessageView from "../message/message-view";
import eventEmitter from "../../../utils/event-emitter/event-emitter";
import { EventsMap } from "../../../utils/event-emitter/events";
import RoomHeader from "./room-header/room-header";
import line from "./room-line/room-line";

class RoomView extends Component {
  private header: Component<HTMLElement>;

  private container: Component<HTMLElement>;

  private form: Component<HTMLElement>;

  private textField: Component<HTMLElement>;

  private scrollTopValue = 0;

  private sendButton: Component<HTMLButtonElement>;

  private line: Component<HTMLElement>;

  private lineShown = false;

  private isOpened = false;

  constructor(
    private login: string,
    private status: boolean,
  ) {
    super("div", ["room"], {}, {});
    this.header = new RoomHeader(login);
    this.container = div(["room__messages"]);
    this.container.addListener("scrollend", () => {
      if (this.isOpened) {
        eventEmitter.emit(EventsMap.scrollMessagesContainer);
      }
    });
    this.container.addListener("click", () => {
      if (this.isOpened) {
        eventEmitter.emit(EventsMap.messageContainerClicked);
      }
    });
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
    this.line = line();
  }

  public showLine(): void {
    if (!this.lineShown) {
      this.container.append(this.line);
      this.scrollTopValue = this.container.getComponent().scrollHeight;
      this.lineShown = true;
    }
  }

  public scrollIntoView(): void {
    if (!this.isOpened && this.lineShown) {
      this.line.getComponent().scrollIntoView({ block: "center", inline: "nearest" });
    }
    if (!this.isOpened && !this.lineShown) {
      const container = this.container.getComponent();
      container.scrollTop = container.scrollHeight;
    }
  }

  public setOpened(): void {
    this.scrollIntoView();
    setTimeout(() => {
      this.isOpened = true;
    }, 1000);
  }

  public setClosed(): void {
    this.isOpened = false;
  }

  public hideLine(): void {
    if (this.lineShown) {
      this.line.getComponent().remove();
      this.lineShown = false;
    }
  }

  public updateStatus(status: boolean): void {
    if (status) {
      this.getComponent().classList.add("room_oneline");
    } else {
      this.getComponent().classList.remove("room_oneline");
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
    container.scrollTo({ behavior: "smooth", top: container.scrollHeight });
  }

  public appendMessage(message: MessageView): void {
    if (message.isMineMessage()) {
      const container = this.container.getComponent();
      container.scrollTo({ behavior: "smooth", top: container.scrollHeight });
    } else if (!message.isReaded()) {
      this.showLine();
    }
    this.container.append(message);
  }
}

export default RoomView;
