import { IEngineStatusResponse } from "../../services/api/response-interfaces";
import { setEngineStatus, setEngineStatusToDrive } from "../../services/api/set-engine-status";
import State from "../../services/state-manager/state";
import CAR_STATES from "./car-states";

class CarEngine extends State {
  public abortController: AbortController = new AbortController();

  private engineParams: IEngineStatusResponse | null = null;

  constructor(private carId: number) {
    super({
      currentState: "in-garage",
      states: CAR_STATES,
      callbacks: {
        "prepare-car": async () => {
          this.engineParams = await setEngineStatus(this.carId, "started");
        },
        "move-car": async () => {
          if (!this.engineParams) return;
          const driveCar = await setEngineStatusToDrive(this.carId, this.abortController);
          // TODO start animation of the car
          if (!driveCar.success) this.emit("broke");
          if (driveCar.success) this.emit("finish");
        },
        "stop-car-animation": () => {
          // TODO stop animation of the car
        },
      },
    });
  }
}

export default CarEngine;
