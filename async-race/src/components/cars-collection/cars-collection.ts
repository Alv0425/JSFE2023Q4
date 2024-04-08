import Car from "../car/car";
import { getAllCars } from "../../services/api/get-cars";
import eventEmitter from "../../utils/event-emitter";
import Pagination from "../../services/pagination-service/pagination";
import { create100Cars } from "../../services/api/create-car";
import winnersCollection from "../winners-collection/winners-collection";
import { ICarResponse } from "../../types/response-interfaces";

class CarsCollection extends Pagination<Car> {
  constructor() {
    super([], 7);
    eventEmitter.on("car-created", () => {
      this.updateCarsCollection();
      eventEmitter.emit("collection-changed");
    });
    eventEmitter.on("generate-random-cars", async () => {
      await create100Cars();
      this.updateCarsCollection();
      eventEmitter.emit("collection-changed");
    });
  }

  async removeCar(id: number): Promise<void> {
    const index: number = this.collection.findIndex((car) => car.getID() === id);
    this.collection[index].remove();
    await winnersCollection.removeWinner(id);
    this.removeItem(index);
    eventEmitter.emit("car-removed");
  }

  async checkCollection(): Promise<boolean> {
    const collectionOnClient: number[] = this.collection.map((car) => car.getID());
    const carsOnServer: ICarResponse[] = await getAllCars();
    if (carsOnServer.length !== this.collection.length) return false;
    return carsOnServer.every((car, i) => car.id === collectionOnClient[i]);
  }

  async reloadCarsCollection(): Promise<void> {
    const cars: ICarResponse[] = await getAllCars();
    const carsComponents: Car[] = cars.map((car) => {
      const newCar: Car = new Car(car.id, car.name, car.color);
      newCar.controls.carDeleteButton.addListener("click", () => this.removeCar(newCar.getID()));
      return newCar;
    });
    this.updateCollection(carsComponents);
  }

  async updateCarsCollection(): Promise<void> {
    const cars: ICarResponse[] = await getAllCars();
    const carsComponents: Car[] = cars.map((car, i) => {
      if (i < this.collection.length) {
        if (car.id === this.collection[i].getID()) return this.collection[i];
      }
      const newCar: Car = new Car(car.id, car.name, car.color);
      newCar.controls.carDeleteButton.addListener("click", () => this.removeCar(newCar.getID()));
      return newCar;
    });
    this.updateCollection(carsComponents);
  }
}

const carCollection: CarsCollection = new CarsCollection();

export default carCollection;
