import Component from "../../../../../utils/component";
import eventEmitter from "../../../../../utils/eventemitter";

class GameButton extends Component<HTMLButtonElement> {
  private buttonState: "Check" | "Continue" = "Check";

  public constructor() {
    super("button", ["playboard__button"], {}, { id: "playboard-button", type: "button" });
    this.setTextContent("Check");
    this.getComponent().disabled = true;
    eventEmitter.on("source-block-epmty", () => {
      this.getComponent().disabled = false;
    });
    eventEmitter.on("source-block-filled", () => {
      this.getComponent().disabled = true;
    });
    eventEmitter.on("sentencesolved", () => {
      this.getComponent().disabled = false;
      this.setState("Continue");
    });
    eventEmitter.on("sentencearranged", () => {
      this.getComponent().disabled = false;
      this.setState("Continue");
    });
    eventEmitter.on("startsentence", () => {
      this.getComponent().disabled = true;
      this.setState("Check");
    });
    this.addListener("click", () => {
      if (this.buttonState === "Check") {
        eventEmitter.emit("check-sentence");
      }
      if (this.buttonState === "Continue") eventEmitter.emit("continue-game");
    });
    eventEmitter.on("reveal-image", () => {
      this.getComponent().disabled = true;
      setTimeout(() => {
        this.getComponent().disabled = false;
      }, 2000);
    });
  }

  private setState(state: "Continue" | "Check") {
    this.buttonState = state;
    this.setTextContent(this.buttonState);
  }
}

export default GameButton;
