import type { IDriveStatusResponse } from "../../../types/response-interfaces";
import { setEngineStatusToDrive } from "../../../services/api/set-engine-status";
import LABELS from "../../car/car-labels";
import type { IRaceParticipants } from "../race-interfaces";

async function getCarRaceResult(car: IRaceParticipants, controller: AbortController): Promise<IRaceParticipants> {
  if (!car.raceParams) {
    return Promise.reject(new Error(`not found`));
  }
  if (car.raceParams.error) {
    return Promise.reject(new Error(`not found`));
  }
  car.component.animateMove(car.raceParams.distance / car.raceParams.velocity);
  const carResult: IDriveStatusResponse = await setEngineStatusToDrive(car.carInfo.id, controller);
  if (carResult.success) {
    car.component.stopMoving();
    car.component.updateCarStateLabel(LABELS.finished);
    return car;
  }
  if (!carResult.success) {
    car.component.stopMoving();
  }
  if (carResult.status === 500) {
    car.component.updateCarStateLabel(LABELS.broken);
  }
  if (carResult.status === 404) {
    car.component.updateCarStateLabel(LABELS.broken);
  }
  return Promise.reject(carResult.status);
}

export default getCarRaceResult;
