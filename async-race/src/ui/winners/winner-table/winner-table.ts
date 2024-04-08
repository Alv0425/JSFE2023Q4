import Winner from "../../../components/winner/winner";
import winnersCollection from "../../../components/winners-collection/winners-collection";
import Component from "../../../utils/component";
import eventEmitter from "../../../utils/event-emitter";
import tableBody from "./table-body";
import tableControls from "./table-controls";
import tableHeader from "./table-header";

class WinnersTable extends Component {
  currentWinners: Winner[] = [];

  currentPageIndex: number = 0;

  constructor() {
    super("div", ["winners__table"], {}, {});
    this.appendContent([tableControls, tableHeader, tableBody]);
    this.update();
    eventEmitter.on("winners-collection-changed", () => this.update());
    eventEmitter.on("open-prev-winners-page", () => this.prevPage());
    eventEmitter.on("open-next-winners-page", () => this.nextPage());
  }

  public update(): void {
    winnersCollection.reloadWinnersCollection().then(() => this.updateContent());
  }

  updateContent(): void {
    tableBody.clearContainer();
    this.currentWinners = winnersCollection.getItemsOnPage(this.currentPageIndex);
    tableBody.appendContent(this.currentWinners);
    tableControls.setTotalCount(winnersCollection.getItemCount());
    tableControls.updatePaginationLabel(`${this.currentPageIndex + 1} / ${winnersCollection.getPageCount()}`);
  }

  public nextPage(): void {
    if (this.currentPageIndex === winnersCollection.getPageCount() - 1) return;
    this.currentPageIndex += 1;
    this.redrawPageContent();
  }

  public prevPage(): void {
    if (this.currentPageIndex === 0) return;
    this.currentPageIndex -= 1;
    this.redrawPageContent();
  }

  private redrawPageContent(): void {
    tableBody.clearContainer();
    this.currentWinners = winnersCollection.getItemsOnPage(this.currentPageIndex);
    if (this.currentWinners.length === 0) {
      tableControls.setTotalCount(winnersCollection.getItemCount());
      this.prevPage();
      return;
    }
    tableBody.appendContent(this.currentWinners);
    tableControls.setTotalCount(winnersCollection.getItemCount());
    tableControls.updatePaginationLabel(`${this.currentPageIndex + 1} / ${winnersCollection.getPageCount()}`);
  }
}

const winnersTable = new WinnersTable();

export default winnersTable;
