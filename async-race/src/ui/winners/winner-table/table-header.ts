import Component from "../../../utils/component";
import { button, span } from "../../../utils/elements";
import eventEmitter from "../../../utils/event-emitter";

class TableHeader extends Component {
  wins: Component<HTMLButtonElement>;

  time: Component<HTMLButtonElement>;

  constructor() {
    super(
      "div",
      ["winners__table-header"],
      {},
      {},
      span(["winners__table-number"], "#"),
      span(["winners__table-color"], "color"),
      span(["winners__table-name"], "name"),
    );
    this.wins = button(["winners__table-wins"], "wins");
    this.time = button(["winners__table-time", "asc"], "time");
    this.appendContent([this.wins, this.time]);
    this.wins.addListener("click", () => eventEmitter.emit("change-sort-win"));
    this.time.addListener("click", () => eventEmitter.emit("change-sort-time"));
    eventEmitter.on("winners-sorted-desc-wins", () => this.setDescWins());
    eventEmitter.on("winners-sorted-asc-wins", () => this.setAscWins());
    eventEmitter.on("winners-sorted-desc-time", () => this.setDescTime());
    eventEmitter.on("winners-sorted-asc-time", () => this.setAscTime());
  }

  private resetSortAppearance(): void {
    this.time.getComponent().className = "winners__table-time";
    this.wins.getComponent().className = "winners__table-wins";
  }

  setDescWins(): void {
    this.resetSortAppearance();
    this.wins.getComponent().classList.add("desc");
  }

  setAscWins(): void {
    this.resetSortAppearance();
    this.wins.getComponent().classList.add("asc");
  }

  setDescTime(): void {
    this.resetSortAppearance();
    this.time.getComponent().classList.add("desc");
  }

  setAscTime(): void {
    this.resetSortAppearance();
    this.time.getComponent().classList.add("asc");
  }
}

const tableHeader = new TableHeader();

export default tableHeader;
