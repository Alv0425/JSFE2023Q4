import "./room.css";
import { button, div, form, svgSprite } from "../../../utils/component/elements";
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

  private isEditingMode = false;

  private edditingMessage = {
    text: "",
    id: "",
  };

  private sendButton: Component<HTMLButtonElement>;

  private line: Component<HTMLElement>;

  private lineShown = false;

  private isOpened = false;

  private ignoreNextScrollEvent = false;

  private containerWrapper: Component<HTMLElement>;

  constructor(
    private login: string,
    private status: boolean,
  ) {
    super("div", ["room"], {}, {});
    this.header = new RoomHeader(login);
    this.container = div(["room__messages"]);
    this.container.addListener("scrollend", () => {
      if (this.isOpened && !this.ignoreNextScrollEvent) {
        eventEmitter.emit(EventsMap.scrollMessagesContainer);
      }
      this.ignoreNextScrollEvent = false;
    });
    this.form = form(["room__form"]);
    this.textField = new Component("textarea", ["room__text-container"]);
    this.sendButton = button(["room__send-button"], "", svgSprite("./assets/icons/send.svg#send", "room__button-icon"));
    this.sendButton.getComponent().disabled = true;
    this.form.appendContent([this.textField, this.sendButton]);
    this.updateStatus(status);
    this.containerWrapper = div(["room__messages-wrapper"], this.container);
    this.containerWrapper.addListener("click", () => {
      if (this.isOpened) {
        eventEmitter.emit(EventsMap.messageContainerClicked);
      }
    });
    this.appendContent([this.header, this.containerWrapper, this.form]);
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

  private isLineVisible(): boolean {
    const diff =
      this.line.getCoordinates().y - this.container.getCoordinates().y - this.line.getCoordinates().height * 2;
    return diff > 0;
  }

  public scrollIntoView(): void {
    if (!this.isOpened && this.lineShown) {
      this.line.getComponent().scrollIntoView({ block: "start", inline: "nearest" });
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
    if (this.isEditingMode) {
      this.applyEdit();
    } else {
      eventEmitter.emit(EventsMap.sendMessageCkick, { login: this.login, text: this.getTextContent() });
    }
    this.isEditingMode = false;
    this.clearField();
    this.sendButton.getComponent().disabled = true;
  }

  public scrollToBottom(): void {
    if (!this.isLineVisible()) {
      return;
    }
    const mcontainer = this.container.getComponent();
    mcontainer.scrollTop = mcontainer.scrollHeight;
    if (!this.isLineVisible()) {
      this.line.getComponent().scrollIntoView({ block: "start", inline: "nearest" });
    }
  }

  public appendMessage(message: MessageView): void {
    if (message.isMineMessage()) {
      const container = this.container.getComponent();
      this.container.append(message);
      container.scrollTo({ behavior: "smooth", top: container.scrollHeight });
    } else if (!message.isReaded()) {
      this.ignoreNextScrollEvent = true;
      this.showLine();
      this.container.append(message);
    } else {
      this.container.append(message);
    }
  }

  public toEditMode(text: string, id: string): void {
    (this.textField.getComponent() as HTMLTextAreaElement).value = text;
    this.sendButton.getComponent().disabled = false;
    this.edditingMessage = { id, text };
    this.isEditingMode = true;
  }

  public closeEditMode(): void {
    (this.textField.getComponent() as HTMLTextAreaElement).value = "";
    this.sendButton.getComponent().disabled = true;
    this.edditingMessage = { id: "", text: "" };
    this.isEditingMode = false;
  }

  private applyEdit(): void {
    if (!this.isEditingMode) {
      return;
    }
    const { value } = this.textField.getComponent() as HTMLTextAreaElement;
    if (this.edditingMessage.text === value) {
      return;
    }
    eventEmitter.emit(EventsMap.applyEditMessage, { text: value, id: this.edditingMessage.id });
  }
}

export default RoomView;
