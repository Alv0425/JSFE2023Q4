import eventEmitter from "../../../utils/event-emitter";
import { IRaceParticipants } from "../race-interfaces";

async function resetRace(cars: IRaceParticipants[]): Promise<void> {
  await Promise.allSettled(cars.map(async (car) => car.component.resetRace()));
  eventEmitter.emit("reset-race");
}

export default resetRace;
