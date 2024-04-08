import { assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import ENDPOINTS from "./endpoints";
import generateRandomCarOptions from "./generate-random-options";
import { ICarOptions, ICarResponse, carResponseTemplate } from "../../types/response-interfaces";

async function createCar(options?: ICarOptions): Promise<ICarResponse> {
  try {
    let carParams: ICarOptions | undefined = options;
    if (!options) carParams = generateRandomCarOptions();
    const response: Response = await fetch(ENDPOINTS.GARAGE, {
      method: "POST",
      body: JSON.stringify(carParams),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.log(`Cannot create car with options ${carParams}`);
      return { ...carResponseTemplate, error: true };
    }
    const car: unknown = await response.json();
    assertsObjectIsTypeOf(car, carResponseTemplate);
    return car;
  } catch {
    console.log(`Cannot create car`);
    return { ...carResponseTemplate, error: true };
  }
}

export async function create100Cars(): Promise<ICarResponse[]> {
  const promises: Promise<ICarResponse>[] = [];
  for (let i = 0; i < 100; i += 1) {
    promises.push(createCar());
  }
  const res: ICarResponse[] = await Promise.all(promises);
  return res.filter((car) => !car.error);
}

export default createCar;
