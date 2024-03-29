import Car from "../../../components/car/car";
import { getAllCars } from "../../../services/api/get-cars";
import Pagination from "../../../services/pagination-service/pagination";

class CarsCollection extends Pagination<Car> {
  constructor() {
    super([], 7);
  }

  async updateCarsCollection() {
    const cars = await getAllCars();
    console.log(cars);
    const carsComponents = cars.map((car) => new Car(car.id, car.name, car.color));
    this.updateCollection(carsComponents);
  }
}

const carCollection = new CarsCollection();

export default carCollection;
