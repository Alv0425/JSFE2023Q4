import { IEngineStatusResponse } from "../../services/api/response-interfaces";
import { setEngineStatus, setEngineStatusToDrive } from "../../services/api/set-engine-status";
import State from "../../services/state-manager/state";
import Component from "../../utils/component";
// import animateCar from "./car-animation";
import CAR_STATES from "./car-states";

interface ICarCallbacks {
  onmoveControls: () => void;
  unlockAllControls: () => void;
  lockStopButton: () => void;
  startAnimation: (duration: number) => void;
  stopAnimation: () => void;
}

class CarEngine extends State {
  public abortController: AbortController = new AbortController();

  private carTrack: Component | null = null;

  private car: SVGSVGElement | null = null;

  private animation: {
    id: number;
  } = { id: 0 };

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
          // if (this.car && this.carTrack) {
          //   this.animation = animateCar(
          //     this.car,
          //     this.engineParams.distance / this.engineParams.velocity,
          //     this.carTrack,
          //   );
          // }
          this.emit("move-car");
        },
        "move-car": async () => {
          if (!this.engineParams) return;
          const driveCar = await setEngineStatusToDrive(this.carId, this.abortController);
          if (!driveCar.success) this.emit("broke");
          if (driveCar.success) this.emit("finish");
        },
        "stop-car-animation": async () => {
          // cancelAnimationFrame(this.animation.id);
          if (this.carControls) this.carControls.stopAnimation();
        },
        "abort-fetch": async () => {
          this.abortController.abort("Car stoped");
        },
        reset: async () => {
          // cancelAnimationFrame(this.animation.id);
          this.engineParams = await setEngineStatus(this.carId, "stopped");
          if (this.carControls) this.carControls.stopAnimation();
          // this.car?.style.removeProperty("transform");
          this.abortController.abort("Car stoped");
          if (this.carControls) this.carControls.lockStopButton();
        },
      },
    });
  }

  public setCarTrack(track: Component) {
    this.carTrack = track;
  }

  public setCar(car: SVGSVGElement) {
    this.car = car;
  }

  public getEngineParams() {
    return this.engineParams;
  }

  public on(callbacks: ICarCallbacks) {
    this.carControls = callbacks;
  }
}

export default CarEngine;
