import Component from "../../../../utils/component";
import eventEmitter from "../../../../utils/eventemitter";

class GameButton extends Component<HTMLButtonElement> {
  private buttonState: "Check" | "Continue" = "Check";

  public constructor() {
    super(
      "button",
      ["playboard__button"],
      {},
      { id: "playboard-button", type: "button" },
    );
    this.setTextContent("Check");
    this.getComponent().disabled = true;
    eventEmitter.on("sentencesolved", () => {
      this.changeButtonState();
    });
    eventEmitter.on("source-block-epmty", () => {
      this.getComponent().disabled = false;
    });
    eventEmitter.on("source-block-filled", () => {
      this.getComponent().disabled = true;
    });
    this.addListener("click", () => {
      if (this.buttonState === "Check") {
        eventEmitter.emit("check-sentence");
        console.log("check-sentence");
      }
      if (this.buttonState === "Continue") eventEmitter.emit("continue-game");
    });
  }

  private changeButtonState() {
    this.buttonState = this.buttonState === "Check" ? "Continue" : "Check";
    this.setTextContent(this.buttonState);
    this.getComponent().disabled = false;
  }
}

export default GameButton;
