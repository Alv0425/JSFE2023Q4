import Car from "../../../components/car/car";
import eventEmitter from "../../../utils/event-emitter";
import Component from "../../../utils/component";
import loader from "../../loader-screen/loader-screen";
import carCollection from "../../../components/cars-collection/cars-collection";
import paginationControls from "./garage-pagination-controls";

class GaragePage extends Component {
  currentCars: Car[] = [];

  currentPageIndex: number = 0;

  constructor() {
    super("div", ["garage__pages"], {}, {});
    this.update();
    paginationControls.nextPageButton.addListener("click", () => this.nextPage());
    paginationControls.prevPageButton.addListener("click", () => this.prevPage());
    eventEmitter.on("car-removed", () => this.redrawPageContent());
    eventEmitter.on("actualize-collection", async () => {
      const isActual = await carCollection.checkCollection();
      if (!isActual) this.restore();
    });
    eventEmitter.on("collection-changed", () => this.update());
  }

  private updateContent() {
    loader.close();
    this.currentCars = carCollection.getItemsOnPage(this.currentPageIndex);
    this.appendContent(this.currentCars);
    paginationControls.setTotalCount(carCollection.getItemCount());
    paginationControls.updatePaginationLabel(`${this.currentPageIndex + 1} / ${carCollection.getPageCount()}`);
  }

  public update() {
    loader.draw();
    carCollection.updateCarsCollection().then(() => this.updateContent());
  }

  public restore() {
    this.clearAll();
    loader.draw();
    carCollection.reloadCarsCollection().then(() => this.updateContent());
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
    if (this.currentCars.length === 0) {
      paginationControls.setTotalCount(carCollection.getItemCount());
      this.prevPage();
      return;
    }
    this.appendContent(this.currentCars);
    paginationControls.setTotalCount(carCollection.getItemCount());
    paginationControls.updatePaginationLabel(`${this.currentPageIndex + 1} / ${carCollection.getPageCount()}`);
  }
}

const garageContent = new GaragePage();

export default garageContent;
