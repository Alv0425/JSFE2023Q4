import "./statisticspage.css";
import Component from "../../../utils/component";
import { button, div, h2 } from "../../../utils/elements";
import eventEmitter from "../../../utils/eventemitter";
import storage from "../../services/localstorage";

class StatisticsPage extends Component {
  public buttonsContainer: Component<HTMLElement>;

  // public roundTitle: Component<HTMLElement>;

  public roundSentences: {
    known: Component[];
    unlnown: Component[];
  } = {
    known: [],
    unlnown: [],
  };

  // public roundInfo: Component<HTMLElement>;

  public constructor() {
    super(
      "div",
      ["statistics-page"],
      {},
      {},
      div(["statistics-page__header"], h2(["statistics-page__header-title"], "Results")),
    );
    this.buttonsContainer = div(["statistics-page__buttons"]);
    const backButton = button(["statistics-page__button"], "Back To Game", "button", "back-button");
    this.append(this.buttonsContainer);
    const continueButton = button(["statistics-page__button"], "Continue", "button", "results-continue-button");
    this.buttonsContainer.appendContent([backButton, continueButton]);
    backButton.addListener("click", () => this.closePage());
    continueButton.addListener("click", () => {
      this.closePage();
      eventEmitter.emit("continue-game");
    });
    eventEmitter.on("round-completed", () => this.updateResults());
  }

  public updateResults() {
    const currentStats = storage.getCurrentRoundStats();
    console.log(currentStats);
  }

  public closePage() {
    this.getComponent().classList.add("fade-out");
    setTimeout(() => {
      this.getComponent().classList.remove("fade-out");
      eventEmitter.emit("statistics-page-closed");
    }, 500);
  }
}

const statistics = new StatisticsPage();
export default statistics;
