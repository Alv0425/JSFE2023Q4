import { IEngineStatusResponse } from "../../types/response-interfaces";
import { setEngineStatus, setEngineStatusToDrive } from "../../services/api/set-engine-status";
import State from "../../services/state-manager/state";
import { ICarCallbacks } from "./car-interfaces";
import LABELS from "./car-labels";
import CAR_STATES from "./car-states";

class CarEngine extends State {
  public abortController: AbortController = new AbortController();

  private engineParams: IEngineStatusResponse | null = null;

  carControls: ICarCallbacks | null = null;

  constructor(private carId: number) {
    super({
      currentState: "in-garage",
      states: CAR_STATES,
      callbacks: {
        "prepare-car": async () => {
          await this.prepare();
        },
        "move-car": async () => {
          await this.move();
        },
        "stop-car-animation": () => this.carControls?.stopAnimation(),
        reset: async () => {
          await this.reset();
        },
        "lock-control-buttons": () => {},
      },
    });
  }

  public abort() {
    this.abortController.abort();
  }

  public on(callbacks: ICarCallbacks) {
    this.carControls = callbacks;
  }

  private async prepare() {
    this.abortController = new AbortController();
    if (this.carControls) this.carControls.onmoveControls();
    this.engineParams = await setEngineStatus(this.carId, "started");
    if (this.carControls) this.carControls.startAnimation(this.engineParams.distance / this.engineParams.velocity);
    this.emit("move-car");
  }

  private async move() {
    if (!this.engineParams) return;
    const driveCar = await setEngineStatusToDrive(this.carId, this.abortController);
    if (!driveCar.success) {
      this.emit("broke");
      if (driveCar.status === 500) this.carControls?.setCarStatus(LABELS.broken);
      if (driveCar.status === 404) this.carControls?.setCarStatus(LABELS.error);
    }
    if (driveCar.success) {
      this.emit("finish");
      this.carControls?.setCarStatus(LABELS.finished);
    }
  }

  private async reset() {
    this.engineParams = await setEngineStatus(this.carId, "stopped");
    this.carControls?.stopAnimation();
    this.abortController.abort("Car stoped");
    this.carControls?.lockStopButton();
    this.carControls?.moveCarToStart();
  }
}

export default CarEngine;
