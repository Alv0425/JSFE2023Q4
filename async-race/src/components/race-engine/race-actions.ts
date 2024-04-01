import { getCarsOnPage } from "../../services/api/get-cars";
import { ICarResponse, IDriveStatusResponse, IEngineStatusResponse } from "../../services/api/response-interfaces";
import { setEngineStatus, setEngineStatusToDrive } from "../../services/api/set-engine-status";
import carCollection from "../cars-collection/cars-collection";
import winnermodal from "./winner-modal/winner-modal";
import Car from "../car/car";
import { IRaceParticipants } from "./race-interfaces";
import winnersCollection from "../winners-collection/winners-collection";

export async function prepareCarsOnPage(n: number): Promise<IRaceParticipants[]> {
  const cars: ICarResponse[] = await getCarsOnPage(n);
  const carsComponents: Car[] = carCollection.getItemsOnPage(n - 1);
  const carsEngines: Promise<IEngineStatusResponse>[] = cars.map(async (car, index) => {
    if (carsComponents[index].engine.getCurrentState() !== "in-garage") await setEngineStatus(car.id, "stopped");
    const carEngine: IEngineStatusResponse = await setEngineStatus(car.id, "started");
    carsComponents[index].engine.emit("start-race");
    return carEngine;
  });
  const engineParams: IEngineStatusResponse[] = await Promise.all(carsEngines);
  return cars.map((car, index) => ({
    carInfo: car,
    raceParams: engineParams[index],
    component: carsComponents[index],
  }));
}

function createWinner(winner: IRaceParticipants): void {
  winnersCollection.addWinner(winner);
}

async function getCarRaceResult(car: IRaceParticipants, controller: AbortController) {
  if (!car.raceParams) return Promise.reject(new Error(`Car is not found`));
  car.component.animateMove(car.raceParams.distance / car.raceParams.velocity);
  car.component.controls.lockAllControls();
  const carResult: IDriveStatusResponse = await setEngineStatusToDrive(car.carInfo.id, controller);
  if (carResult.success) {
    car.component.stopMoving();
    return car;
  }
  if (!carResult.success) car.component.stopMoving();
  return Promise.reject(new Error(`Car is stopped`));
}

export async function startRace(cars: IRaceParticipants[], controller: AbortController): Promise<void> {
  const carsRace: Promise<IRaceParticipants>[] = cars.map(async (car) => getCarRaceResult(car, controller));
  Promise.allSettled(carsRace).then(() => {
    cars.forEach(async (car) => {
      await setEngineStatus(car.component.getID(), "stopped");
      car.component.controls.lockControlsOnMove();
      car.component.engine.emit("finish");
    });
    console.log("Race ended");
  });
  const winner: IRaceParticipants = await Promise.any(carsRace);
  if (winner) createWinner(winner);
  winnermodal.openWinModal(winner);
}

export function resetRace(cars: IRaceParticipants[]): void {
  cars.forEach(async (car) => {
    await car.component.resetMoving();
  });
}
