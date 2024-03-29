import Car from "../../../components/car/car";
import Component from "../../../utils/component";
import loader from "../../loader-screen/loader-screen";
import carCollection from "./cars-collection";
import paginationControls from "./garage-pagination-controls";

class GaragePage extends Component {
  currentCars: Car[] = [];

  currentPageIndex: number = 0;

  constructor() {
    super("div", ["garage__pages"], {}, {});
    this.update();
    paginationControls.nextPageButton.addListener("click", () => this.nextPage());
    paginationControls.prevPageButton.addListener("click", () => this.prevPage());
  }

  public update() {
    loader.draw();
    carCollection.updateCarsCollection().then(() => {
      loader.close();
      this.currentCars = carCollection.getItemsOnPage(this.currentPageIndex);
      this.appendContent(this.currentCars);
      paginationControls.setTotalCount(carCollection.getItemCount());
      paginationControls.updatePaginationLabel(`${this.currentPageIndex + 1} / ${carCollection.getPageCount()}`);
    });
  }

  public nextPage() {
    if (this.currentPageIndex === carCollection.getPageCount() - 1) return;
    this.currentPageIndex += 1;
    this.redrawPageContent();
  }

  public prevPage() {
    if (this.currentPageIndex === 0) return;
    this.currentPageIndex -= 1;
    this.redrawPageContent();
  }

  private redrawPageContent() {
    this.clearAll();
    this.currentCars = carCollection.getItemsOnPage(this.currentPageIndex);
    this.appendContent(this.currentCars);
    paginationControls.updatePaginationLabel(`${this.currentPageIndex + 1} / ${carCollection.getPageCount()}`);
  }
}

const garageContent = new GaragePage();

export default garageContent;
