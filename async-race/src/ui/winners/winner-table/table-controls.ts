import Component from "../../../utils/component";
import { button, div, h3, span } from "../../../utils/elements";
import eventEmitter from "../../../utils/event-emitter";

class TableControls extends Component {
  private title: Component<HTMLElement>;

  private prevPageButton: Component<HTMLButtonElement>;

  private nextPageButton: Component<HTMLButtonElement>;

  private paginationLabel: Component<HTMLElement>;

  constructor() {
    super("div", ["winners__table-controls"], {}, {});
    this.title = h3(["winners__table-title"], "");
    this.prevPageButton = button(["winners__pagination-prev"], "<");
    this.nextPageButton = button(["winners__pagination-next"], ">");
    this.paginationLabel = span(["winners__pagination-label"], "");
    this.appendContent([
      this.title,
      div(["winners__table-pagination"], this.prevPageButton, this.paginationLabel, this.nextPageButton),
    ]);
    this.prevPageButton.addListener("click", () => eventEmitter.emit("open-prev-winners-page"));
    this.nextPageButton.addListener("click", () => eventEmitter.emit("open-next-winners-page"));
  }

  public setTotalCount(count: number): void {
    this.title.setTextContent(`TOTAL COUNT: ${count}`);
  }

  public updatePaginationLabel(label: string): void {
    this.paginationLabel.setTextContent(label);
  }
}

const tableControls = new TableControls();

export default tableControls;
