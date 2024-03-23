import "./autocomplete.css";
import Component from "../../../../../utils/component";
import eventEmitter from "../../../../../utils/eventemitter";

class AutocompleteButton extends Component<HTMLButtonElement> {
  public constructor() {
    super("button", ["playboard__button"], {}, { id: "playboard-button-autocomplete", type: "button" });
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
    eventEmitter.on("reveal-image", () => this.hideButton());
    eventEmitter.on("statistics-button-hide", () => this.showButton());
    eventEmitter.on("source-block-epmty", () => {
      this.getComponent().disabled = false;
    });
  }

  public showButton() {
    this.getComponent().classList.remove("playboard__autocomplete-button_hide");
  }

  public hideButton() {
    this.getComponent().classList.add("fade-out");
    setTimeout(() => {
      this.getComponent().classList.remove("fade-out");
      this.getComponent().classList.add("playboard__autocomplete-button_hide");
      eventEmitter.emit("autocomplete-hide");
    }, 500);
  }
}

export default AutocompleteButton;
