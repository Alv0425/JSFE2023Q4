import "./garage-pagination-controls.css";
import Component from "../../../utils/component";
import { button, div, h2, span } from "../../../utils/elements";

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
  }

  public setTotalCount(count: number) {
    this.totalCountLabel.setTextContent(`TOTAL COUNT: ${count}`);
  }

  public updatePaginationLabel(label: string) {
    this.paginationLabel.setTextContent(label);
  }
}

const paginationControls = new PaginationControls();
export default paginationControls;
