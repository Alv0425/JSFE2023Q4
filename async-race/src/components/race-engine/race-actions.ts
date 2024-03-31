import { getCarsOnPage } from "../../services/api/get-cars";
import { ICarResponse, IEngineStatusResponse } from "../../services/api/response-interfaces";
import { setEngineStatus, setEngineStatusToDrive } from "../../services/api/set-engine-status";
import Car from "../car/car";

export async function prepareCarsOnPage(n: number) {
  const cars = await getCarsOnPage(n);
  const carsEngines = cars.map(async (car) => {
    const carEngine = await setEngineStatus(car.id, "started");
    return carEngine;
  });
  const engineParams = await Promise.all(carsEngines);
  return cars.map((car, index) => ({
    carInfo: car,
    raceParams: engineParams[index],
  }));
}

export async function startRace(
  cars: {
    carInfo: ICarResponse;
    raceParams: IEngineStatusResponse;
  }[],
  carsObjects: Car[],
  controller?: AbortController,
) {
  if (!cars) return;
  const carsRace = cars.map(async (car, idx) => {
    const carResult = await setEngineStatusToDrive(car.carInfo.id, controller);
    if (carResult.success) {
      carsObjects[idx].stopMoving();
      return car;
    }
    if (!carResult.success) carsObjects[idx].stopMoving();
    return Promise.reject(new Error(`Car is stopped`));
  });
  const winner = await Promise.any(carsRace);
  // TODO open modal
  // TODO handle winner table
  console.log("winner", winner);
  await Promise.allSettled(carsRace);
  carsObjects.forEach(async (car) => {
    await setEngineStatus(car.getID(), "stopped");
    car.controls.lockControlsOnMove();
  });
}

export function resetRace(
  cars: {
    carInfo: ICarResponse;
    raceParams: IEngineStatusResponse;
  }[],
  carsObjects: Car[],
) {
  if (!cars) return;
  cars.forEach(async (car, idx) => {
    const carResult = await setEngineStatus(car.carInfo.id, "stopped");
    carsObjects[idx].stopMoving();
    carsObjects[idx].moveCarToStart();
    carsObjects[idx].controls.lockStopButton();
    return carResult;
  });
}
