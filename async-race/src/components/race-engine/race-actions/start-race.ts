import { setEngineStatus } from "../../../services/api/set-engine-status";
import eventEmitter from "../../../utils/event-emitter";
import winnersCollection from "../../winners-collection/winners-collection";
import { IRaceParticipants } from "../race-interfaces";
import winnermodal from "../winner-modal/winner-modal";
import getCarRaceResult from "./get-car-race-result";

function createWinner(winner: IRaceParticipants): void {
  winnersCollection.addWinner(winner);
  winner.component.updateCarStateLabel("winner");
  winnermodal.openWinModal(winner);
}

async function startRace(cars: IRaceParticipants[], controller: AbortController): Promise<void> {
  const carsRace: Promise<IRaceParticipants>[] = cars.map(async (car) => getCarRaceResult(car, controller));
  Promise.allSettled(carsRace).then(async (res) => {
    await Promise.allSettled(
      cars.map((car) => {
        const status = setEngineStatus(car.component.getID(), "stopped");
        car.component.engine.emit("finish");
        return status;
      }),
    );
    eventEmitter.emit("race-ended");
    if (
      res.every((result) => {
        if (result.status === "rejected") return result.reason === 404;
        return false;
      })
    ) {
      eventEmitter.emit("reset-race-clicked");
    }
  });
  const winner: IRaceParticipants = await Promise.any(carsRace);
  if (winner) createWinner(winner);
}

export default startRace;
