import "./garage-pagination-controls.css";
import Component from "../../../utils/component";
import { button, div, h2, span } from "../../../utils/elements";
import eventEmitter from "../../../utils/event-emitter";

class PaginationControls extends Component {
  totalCountLabel: Component<HTMLElement>;

  prevPageButton: Component<HTMLButtonElement>;

  nextPageButton: Component<HTMLButtonElement>;

  paginationLabel: Component<HTMLElement>;

  constructor() {
    super("div", ["garage__pagination"]);
    this.totalCountLabel = h2(["garage__pagination-total-count"], "");
    this.prevPageButton = button(["garage__pagination-prev"], "<");
    this.nextPageButton = button(["garage__pagination-next"], ">");
    this.paginationLabel = span(["garage__pagination-label"], "");
    this.appendContent([
      this.totalCountLabel,
      div(["garage__pagination-container"], this.prevPageButton, this.paginationLabel, this.nextPageButton),
    ]);
    eventEmitter.on("race-started", () => this.lockPagination());
    eventEmitter.on("race-ended", () => this.unlockPagination());
    eventEmitter.on("reset-race-clicked", () => this.unlockPagination());
  }

  public setTotalCount(count: number): void {
    this.totalCountLabel.setTextContent(`TOTAL COUNT: ${count}`);
  }

  public updatePaginationLabel(label: string): void {
    this.paginationLabel.setTextContent(label);
  }

  public lockPagination(): void {
    this.prevPageButton.getComponent().disabled = true;
    this.nextPageButton.getComponent().disabled = true;
  }

  public unlockPagination(): void {
    this.prevPageButton.getComponent().disabled = false;
    this.nextPageButton.getComponent().disabled = false;
  }
}

const paginationControls = new PaginationControls();
export default paginationControls;
