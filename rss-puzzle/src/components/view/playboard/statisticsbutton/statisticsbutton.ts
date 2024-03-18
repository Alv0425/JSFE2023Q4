import "./statisticsbutton.css";
import Component from "../../../../utils/component";
import eventEmitter from "../../../../utils/eventemitter";

class StatisticsButton extends Component<HTMLButtonElement> {
  public constructor() {
    super("button", ["playboard__statistics-button"], {}, { id: "playboard-button-statistics", type: "button" });
    this.setTextContent("Results");
    this.addListener("click", () => {
      eventEmitter.emit("show-results");
    });
    eventEmitter.on("startsentence", () => {
      this.getComponent().disabled = false;
    });
    eventEmitter.on("open-round", () => this.hideButton());
    eventEmitter.on("autocomplete-hide", () => this.showButton());
  }

  public showButton() {
    this.getComponent().classList.remove("playboard__statistics-button_hide");
    this.getComponent().classList.add("playboard__statistics-button_show");
  }

  public hideButton() {
    this.getComponent().classList.add("fade-out");
    setTimeout(() => {
      this.getComponent().classList.remove("playboard__statistics-button_show");
      this.getComponent().classList.remove("fade-out");
      eventEmitter.emit("statistics-button-hide");
    }, 500);
  }
}

export default StatisticsButton;
