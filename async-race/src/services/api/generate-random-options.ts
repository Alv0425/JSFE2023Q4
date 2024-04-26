import generateRandomColor from "../../utils/generate-random-color";
import type { ICarBrand } from "./car-models";
import CARS from "./car-models";

function generateRandomCarOptions(): { name: string; color: string } {
  const randomCarMaker: ICarBrand = CARS[Math.round(Math.random() * (CARS.length - 1))];
  const randomCarBrandName: string = randomCarMaker.brand;
  const randomCarModel: string = randomCarMaker.models[Math.round(Math.random() * (randomCarMaker.models.length - 1))];
  return {
    name: `${randomCarBrandName} ${randomCarModel}`,
    color: generateRandomColor(),
  };
}

export default generateRandomCarOptions;
