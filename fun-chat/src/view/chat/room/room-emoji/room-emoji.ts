import { button, div } from "../../../../utils/component/elements";
import Component from "../../../../utils/component/component";
import eventEmitter from "../../../../utils/event-emitter/event-emitter";
import { EventsMap } from "../../../../utils/event-emitter/events";

class RoomEmoji extends Component {
  private emojis = {
    face: ["🙂", "😄", "😅", "😂", "😳", "😱", "😎", "😭", "😢", "🙁", "🙃", "😉", "😊", "😇", "🥰", "😍", "😋"],
    hand: ["👍", "👎", "👏", "🙌", "🤝", "🙏", "✊", "🤞", "🤲", "✌️", "🤘", "🖖"],
    objects: ["🔥", "❤️", "💔", "💡", "⚡", "🔨", "🔪", "☂️", "🌼", "🍀", "🍻", "🥂", "🥃", "☕"],
  };

  private button: Component<HTMLButtonElement>;

  private emojisContainer: Component<HTMLElement>;

  constructor() {
    super("div", ["room__emoji-container"]);
    this.button = button(["room__emoji-button"], "🙂");
    this.button.addListener("click", () => this.openEmojiSelector());
    this.emojisContainer = div(["room__emoji-selector"]);
    Object.values(this.emojis).forEach((emojis) => {
      const emojiButtons = emojis.map((emoji) => {
        const btn = button(["emoji"], emoji);
        btn.addListener("click", () => {
          eventEmitter.emit(EventsMap.emojiSelected, emoji);
          this.closeEmojiSelector();
        });
        return btn;
      });
      const emojiCategory = div(["room__emoji-category"], ...emojiButtons);
      this.emojisContainer.append(emojiCategory);
    });
    this.appendContent([this.button, div(["room__emoji-selector-wrapper"], this.emojisContainer)]);
  }

  public openEmojiSelector(): void {
    this.getComponent().classList.add("room__emoji-container_show");
  }

  public closeEmojiSelector(): void {
    this.getComponent().classList.remove("room__emoji-container_show");
  }
}

export default RoomEmoji;
