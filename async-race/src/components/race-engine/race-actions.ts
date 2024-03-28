import { getCarsOnPage } from "../../services/api/get-cars";
import { ICarResponse, IEngineStatusResponse } from "../../services/api/response-interfaces";
import { setEngineStatus, setEngineStatusToDrive } from "../../services/api/set-engine-status";

export async function prepareCarsOnPage(n: number) {
  const cars = await getCarsOnPage(n);
  const carsEngines = cars.map(async (car) => {
    const carEngine = await setEngineStatus(car.id, "started");
    return carEngine;
  });
  const engineParams = await Promise.all(carsEngines);
  return cars.map((car, index) => ({
    carInfo: car,
    carStatus: { success: false },
    raceParams: engineParams[index],
  }));
}

export async function startRace(
  cars: {
    carInfo: ICarResponse;
    raceParams: IEngineStatusResponse;
  }[],
  controller?: AbortController,
) {
  let timer = 0;
  const interval = setInterval(() => {
    timer += 1;
  }, 100);
  if (!cars) return;
  const carsRace = cars.map(async (car) => {
    const carResult = await setEngineStatusToDrive(car.carInfo.id, controller);
    // animate car with id
    console.log(carResult);
    if (carResult.success) {
      console.log(`Car is finished ${timer * 100}, ${car.raceParams.distance / car.raceParams.velocity}`);
      return car;
    }
    if (!carResult.success) {
      console.log(`Car is stopped ${timer}, ${car.raceParams.distance / car.raceParams.velocity}`);
      // stop animation of the car with id
    }
    return Promise.reject(new Error(`Car is stopped ${timer}`));
  });
  const winner = await Promise.any(carsRace);
  // TODO open modal
  // TODO handle winner table
  console.log("winner", winner);
  await Promise.allSettled(carsRace);
  clearInterval(interval);
}
