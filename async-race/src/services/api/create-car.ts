import { assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import ENDPOINTS from "./endpoints";
import generateRandomCarOptions from "./generate-random-options";
import { ICarOptions, carResponseTemplate } from "./response-interfaces";

async function createCar(options?: ICarOptions) {
  let carParams = options;
  if (!options) carParams = generateRandomCarOptions();
  const response = await fetch(ENDPOINTS.GARAGE, {
    method: "POST",
    body: JSON.stringify(carParams),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Cannot create car with options ${carParams}`);
  } else {
    const car: unknown = await response.json();
    assertsObjectIsTypeOf(car, carResponseTemplate);
    return car;
  }
}

export async function create100Cars() {
  const promises = [];
  for (let i = 0; i < 100; i += 1) {
    promises.push(createCar());
  }
  const res = await Promise.all(promises);
  return res;
}

export default createCar;
