import { EventsMap } from "../../../../utils/event-emitter/events";
import Component from "../../../../utils/component/component";
import { button, svgSprite } from "../../../../utils/component/elements";
import RoomEmoji from "../room-emoji/room-emoji";
import eventEmitter from "../../../../utils/event-emitter/event-emitter";

class RoomForm extends Component {
  public textField: Component<HTMLTextAreaElement>;

  public button: Component<HTMLButtonElement>;

  public emojiSelector: RoomEmoji;

  constructor(private login: string) {
    super("form", ["room__form"], {}, { action: "" });
    this.textField = new Component("textarea", ["room__text-container"]);
    this.button = button(["room__send-button"], "", svgSprite("./assets/icons/send.svg#send", "room__button-icon"));
    this.emojiSelector = new RoomEmoji();
    this.button.getComponent().disabled = true;
    this.appendContent([this.textField, this.emojiSelector, this.button]);
    this.textField.addListener("keyup", () => this.checkText());
    this.textField.addListener("keypress", (evt) => {
      const event = evt as KeyboardEvent;
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        this.button.getComponent().click();
      }
    });
  }

  public edit(text: string): void {
    this.setInputValue(text);
    this.button.getComponent().disabled = false;
    this.textField.getComponent().focus();
  }

  public closeEdit(): void {
    this.setTextContent("");
    this.button.getComponent().disabled = true;
  }

  public closeEmojiSelector(): void {
    this.emojiSelector.closeEmojiSelector();
  }

  private checkText(): void {
    this.button.getComponent().disabled = this.getTextContent().replace(/[\s]+/g, "") === "";
  }

  public getTextContent(): string {
    return this.textField.getComponent().value;
  }

  public setInputValue(str: string): void {
    this.textField.getComponent().value = str;
  }

  public clearField(): void {
    this.setInputValue("");
  }

  public addEmoji(emoji: string): void {
    const value = this.getTextContent();
    this.setInputValue(value + emoji);
    this.checkText();
    this.textField.getComponent().focus();
  }

  public resetField(): void {
    this.clearField();
    this.closeEmojiSelector();
    this.button.getComponent().disabled = true;
  }

  public applyEdit(initialMessage: { text: string; id: string }): void {
    const value = this.getTextContent();
    if (initialMessage.text === value) {
      return;
    }
    eventEmitter.emit(EventsMap.applyEditMessage, { text: value, id: initialMessage.id });
  }

  public sendMessage(): void {
    eventEmitter.emit(EventsMap.sendMessageCkick, { login: this.login, text: this.getTextContent() });
  }
}

export default RoomForm;
