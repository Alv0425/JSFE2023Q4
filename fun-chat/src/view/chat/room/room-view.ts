import "./room.css";
import { div } from "../../../utils/component/elements";
import Component from "../../../utils/component/component";
import type MessageView from "../message/message-view";
import eventEmitter from "../../../utils/event-emitter/event-emitter";
import { EventsMap } from "../../../utils/event-emitter/events";
import RoomHeader from "./room-header/room-header";
import line from "./room-line/room-line";
import messagePlaceholder from "./message-placeholder/message-placeholder";
import throttle from "../../../utils/helpers/throttle";
import RoomForm from "./text-field/text-field";

class RoomView extends Component {
  private header: Component<HTMLElement>;

  private container: Component<HTMLElement>;

  private form: RoomForm;

  private isEditingMode = false;

  private edditingMessage = {
    text: "",
    id: "",
  };

  private line: Component<HTMLElement>;

  private lineShown = false;

  private isOpened = false;

  private ignoreNextScrollEvent = false;

  private containerWrapper: Component<HTMLElement>;

  private placeholder: Component<HTMLElement>;

  constructor(
    private login: string,
    private status: boolean,
  ) {
    super("div", ["room"], {}, {});
    this.header = new RoomHeader(login);
    this.container = div(["room__messages"]);
    this.container.addListener("scrollend", () => this.scrollEndHandler());
    this.container.addListener("scroll", throttle(this.scrollHandler.bind(this), 500));
    this.form = new RoomForm(login);
    this.updateStatus(status);
    this.containerWrapper = div(["room__messages-wrapper"], this.container);
    this.containerWrapper.addListener("click", () => {
      this.form.closeEmojiSelector();
      if (this.isOpened) {
        eventEmitter.emit(EventsMap.messageContainerClicked);
      }
    });
    this.appendContent([this.header, this.containerWrapper, this.form]);
    this.form.button.addListener("click", () => this.sendMessage());
    this.line = line();
    this.placeholder = messagePlaceholder();
    this.showMessagePlaceholder();
  }

  public addEmoji(emoji: string): void {
    this.form.addEmoji(emoji);
  }

  private scrollHandler(): void {
    if (this.isOpened && !this.ignoreNextScrollEvent) {
      eventEmitter.emit(EventsMap.scrollMessagesContainer);
    }
  }

  private scrollEndHandler(): void {
    this.ignoreNextScrollEvent = false;
  }

  public showLine(): void {
    if (!this.lineShown) {
      this.container.append(this.line);
      this.lineShown = true;
    }
  }

  public showMessagePlaceholder(): void {
    this.hideMessagePlaceholder();
    this.containerWrapper.append(this.placeholder);
  }

  public hideMessagePlaceholder(): void {
    this.placeholder.getComponent().remove();
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

  private sendMessage(): void {
    if (!this.isEditingMode) {
      this.form.sendMessage();
    }
    this.applyEdit();
    this.isEditingMode = false;
    this.form.resetField();
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
    this.form.edit(text);
    this.edditingMessage = { id, text };
    this.isEditingMode = true;
  }

  public closeEditMode(): void {
    this.form.closeEdit();
    this.edditingMessage = { id: "", text: "" };
    this.isEditingMode = false;
  }

  private applyEdit(): void {
    if (this.isEditingMode) {
      this.form.applyEdit(this.edditingMessage);
    }
  }
}

export default RoomView;
