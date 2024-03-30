import Car from "../../../components/car/car";
import deleteCarByID from "../../../services/api/delete-car";
import { getAllCars } from "../../../services/api/get-cars";
import eventEmitter from "../../../services/event-emitter";
import Pagination from "../../../services/pagination-service/pagination";

class CarsCollection extends Pagination<Car> {
  constructor() {
    super([], 7);
  }

  async removeCar(id: number) {
    const index = this.collection.findIndex((car) => car.getID() === id);
    this.collection[index].destroy();
    await deleteCarByID(id);
    this.removeItem(index);
    eventEmitter.emit("car-removed");
  }

  async checkCollection() {
    const collectionOnClient = this.collection.map((car) => car.getID());
    const carsOnServer = await getAllCars();
    if (carsOnServer.length !== this.collection.length) return false;
    return carsOnServer.every((car, i) => car.id === collectionOnClient[i]);
  }

  async reloadCarsCollection() {
    const cars = await getAllCars();
    const carsComponents = cars.map((car) => {
      const newCar = new Car(car.id, car.name, car.color);
      newCar.controls.carDeleteButton.addListener("click", () => this.removeCar(newCar.getID()));
      return newCar;
    });
    this.updateCollection(carsComponents);
  }

  async updateCarsCollection() {
    const cars = await getAllCars();
    const carsComponents = cars.map((car, i) => {
      if (i < this.collection.length) {
        if (car.id === this.collection[i].getID()) return this.collection[i];
      }
      const newCar = new Car(car.id, car.name, car.color);
      newCar.controls.carDeleteButton.addListener("click", () => this.removeCar(newCar.getID()));
      return newCar;
    });
    this.updateCollection(carsComponents);
  }
}

const carCollection = new CarsCollection();

export default carCollection;
