import { getCarsOnPage } from "../../../services/api/get-cars";
import type { ICarResponse, IEngineStatusResponse } from "../../../types/response-interfaces";
import { setEngineStatus } from "../../../services/api/set-engine-status";
import eventEmitter from "../../../utils/event-emitter";
import type Car from "../../car/car";
import carCollection from "../../cars-collection/cars-collection";
import type { IRaceParticipants } from "../race-interfaces";

async function prepareCarsOnPage(n: number): Promise<IRaceParticipants[]> {
  eventEmitter.emit("race-started");
  const cars: ICarResponse[] = await getCarsOnPage(n);
  const carsComponents: Car[] = carCollection.getItemsOnPage(n - 1);
  await Promise.allSettled(carsComponents.map(async (car) => car.prepareToRace()));
  const carsEngines: Promise<IEngineStatusResponse>[] = cars.map(async (car) => {
    const carEngine: IEngineStatusResponse = await setEngineStatus(car.id, "started");
    return carEngine;
  });
  const engineParams: IEngineStatusResponse[] = await Promise.all(carsEngines);
  return cars.map((car, index) => ({
    carInfo: car,
    raceParams: engineParams[index],
    component: carsComponents[index],
  }));
}

export default prepareCarsOnPage;
