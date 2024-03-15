import Component from "../../../../utils/component";
import eventEmitter from "../../../../utils/eventemitter";

class AutocompleteButton extends Component<HTMLButtonElement> {
  public constructor() {
    super(
      "button",
      ["playboard__button"],
      {},
      { id: "playboard-button-autocomplete", type: "button" },
    );
    this.setTextContent("Auto-Complete");
    this.addListener("click", () => {
      this.getComponent().disabled = true;
      eventEmitter.emit("autocomplete");
    });
    eventEmitter.on("sentencesolved", () => {
      this.getComponent().disabled = true;
    });
    eventEmitter.on("startsentence", () => {
      this.getComponent().disabled = false;
    });
    eventEmitter.on("source-block-epmty", () => {
      this.getComponent().disabled = false;
    });
  }
}

export default AutocompleteButton;
