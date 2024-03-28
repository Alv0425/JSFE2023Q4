import generateRandoColor from "../../utils/generate-random-color";
import CARS from "./car-models";

function generateRandomCarOptions() {
  const randomCarMaker = CARS[Math.round(Math.random() * (CARS.length - 1))];
  const randomCarBrandName = randomCarMaker.brand;
  const randomCarModel = randomCarMaker.models[Math.round(Math.random() * (randomCarMaker.models.length - 1))];
  return {
    name: `${randomCarBrandName} ${randomCarModel}`,
    color: generateRandoColor(),
  };
}

export default generateRandomCarOptions;
