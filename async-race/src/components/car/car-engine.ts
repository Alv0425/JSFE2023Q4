import { IEngineStatusResponse } from "../../services/api/response-interfaces";
import { setEngineStatus, setEngineStatusToDrive } from "../../services/api/set-engine-status";
import State from "../../services/state-manager/state";
import CAR_STATES from "./car-states";

interface ICarCallbacks {
  onmoveControls: () => void;
  unlockAllControls: () => void;
  lockStopButton: () => void;
  startAnimation: (duration: number) => void;
  stopAnimation: () => void;

  moveCarToStart: () => void;
}

class CarEngine extends State {
  public abortController: AbortController = new AbortController();

  public animationRun = new Promise(() => {});

  private engineParams: IEngineStatusResponse | null = null;

  carControls: ICarCallbacks | null = null;

  constructor(private carId: number) {
    super({
      currentState: "in-garage",
      states: CAR_STATES,
      callbacks: {
        "prepare-car": async () => {
          if (this.carControls) this.carControls.onmoveControls();
          this.engineParams = await setEngineStatus(this.carId, "started");
          if (this.carControls)
            this.carControls.startAnimation(this.engineParams.distance / this.engineParams.velocity);
          this.emit("move-car");
        },
        "move-car": async () => {
          if (!this.engineParams) return;
          const driveCar = await setEngineStatusToDrive(this.carId, this.abortController);
          if (!driveCar.success) this.emit("broke");
          if (driveCar.success) this.emit("finish");
        },
        "stop-car-animation": async () => {
          if (this.carControls) this.carControls.stopAnimation();
        },
        "abort-fetch": async () => {
          this.abortController.abort("Car stoped");
        },
        reset: async () => {
          this.engineParams = await setEngineStatus(this.carId, "stopped");
          if (this.carControls) this.carControls.stopAnimation();
          if (this.carControls) this.carControls.moveCarToStart();
          this.abortController.abort("Car stoped");
          if (this.carControls) this.carControls.lockStopButton();
        },
      },
    });
  }

  public getEngineParams() {
    return this.engineParams;
  }

  public on(callbacks: ICarCallbacks) {
    this.carControls = callbacks;
  }
}

export default CarEngine;
