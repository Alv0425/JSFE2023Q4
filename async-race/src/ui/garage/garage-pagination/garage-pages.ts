import type Car from "../../../components/car/car";
import eventEmitter from "../../../utils/event-emitter";
import Component from "../../../utils/component";
import loader from "../../loader-screen/loader-screen";
import carCollection from "../../../components/cars-collection/cars-collection";
import paginationControls from "./garage-pagination-controls";

class GaragePage extends Component {
  private currentCars: Car[] = [];

  public currentPageIndex = 0;

  constructor() {
    super("div", ["garage__pages"], {}, {});
    this.update();
    paginationControls.nextPageButton.addListener("click", () => this.nextPage());
    paginationControls.prevPageButton.addListener("click", () => this.prevPage());
    eventEmitter.on("car-removed", () => this.redrawPageContent());
    eventEmitter.on("actualize-collection", async () => {
      const isActual = await carCollection.checkCollection();
      if (!isActual) {
        this.restore();
      }
    });
    eventEmitter.on("collection-changed", () => this.update());
    eventEmitter.on("start-race", () => {
      this.currentCars.forEach((car) => car.controls.lockAllControls());
    });
    eventEmitter.on("reset-race-clicked", () => {
      this.currentCars.forEach((car) => {
        if (car.engine.currentState !== "in-garage") {
          car.resetRace();
        }
      });
    });
  }

  private updateContent(): void {
    loader.close();
    this.currentCars = carCollection.getItemsOnPage(this.currentPageIndex);
    this.appendContent(this.currentCars.map((car) => car.getVieW()));
    paginationControls.setTotalCount(carCollection.getItemCount());
    paginationControls.updatePaginationLabel(`${this.currentPageIndex + 1} / ${carCollection.getPageCount()}`);
  }

  public update(): void {
    loader.draw();
    carCollection.updateCarsCollection().then(() => this.updateContent());
  }

  public restore(): void {
    this.clearContainer();
    loader.draw();
    carCollection.reloadCarsCollection().then(() => this.updateContent());
  }

  public nextPage(): void {
    if (this.currentPageIndex === carCollection.getPageCount() - 1) {
      return;
    }
    this.currentPageIndex += 1;
    this.redrawPageContent();
    eventEmitter.emit("pagination-clicked");
  }

  public prevPage(): void {
    if (this.currentPageIndex === 0) {
      return;
    }
    this.currentPageIndex -= 1;
    this.redrawPageContent();
    eventEmitter.emit("pagination-clicked");
  }

  private redrawPageContent(): void {
    this.clearContainer();
    this.currentCars = carCollection.getItemsOnPage(this.currentPageIndex);
    if (this.currentCars.length === 0) {
      paginationControls.setTotalCount(carCollection.getItemCount());
      this.prevPage();
      return;
    }
    this.appendContent(this.currentCars.map((car) => car.getVieW()));
    paginationControls.setTotalCount(carCollection.getItemCount());
    paginationControls.updatePaginationLabel(`${this.currentPageIndex + 1} / ${carCollection.getPageCount()}`);
  }
}

const garageContent = new GaragePage();

export default garageContent;
