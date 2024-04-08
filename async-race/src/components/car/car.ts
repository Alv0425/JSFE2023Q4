import CarEngine from "./car-engine";
import CarControls from "./car-controls";
import CarView from "./car-view/car-view";
import eventEmitter from "../../utils/event-emitter";
import updateCar from "../../services/api/update-car";
import { setEngineStatus } from "../../services/api/set-engine-status";
import { LabelType } from "./car-labels";
import { ICarResponse } from "../../types/response-interfaces";
import deleteCarByID from "../../services/api/delete-car";

class Car {
  public engine = new CarEngine(this.id);

  private carView: CarView = new CarView(this.name, this.color);

  controls: CarControls = this.carView.controls;

  constructor(
    private id: number,
    private name: string,
    private color: string,
  ) {
    this.setEngineControls();
    this.controls.carRunButton.addListener("click", () => this.engine.emit("start-car"));
    this.controls.carStopButton.addListener("click", () => this.engine.emit("reset"));
    this.controls.carEditButton.addListener("click", () => {
      eventEmitter.emit("open-edit-car-modal", { id: this.id, name: this.name, color: this.color });
      eventEmitter.once("edit-car", (props) => {
        const carProps = props as ICarResponse;
        this.updateCar(carProps);
      });
    });
  }

  private async updateCar(carProps: ICarResponse) {
    if (carProps.id !== this.id) return;
    const updatedCar = await updateCar(carProps);
    if (updatedCar.error) return;
    this.name = carProps.name;
    this.color = carProps.color;
    this.carView.updateView(carProps);
    eventEmitter.emit("car-edited");
  }

  public async prepareToRace() {
    await setEngineStatus(this.id, "stopped");
    this.carView.stopMoving();
    this.carView.moveCarToStart();
    this.controls.lockAllControls();
    this.engine.abort();
  }

  public async resetRace() {
    this.carView.stopMoving();
    this.carView.moveCarToStart();
    this.controls.lockStopButton();
    this.engine.abort();
    await setEngineStatus(this.id, "stopped");
  }

  private setEngineControls() {
    this.engine.on({
      onmoveControls: () => this.controls.lockControlsOnMove(),
      unlockAllControls: () => this.controls.unlockAllControls(),
      lockControls: () => this.controls.lockAllControls(),
      lockStopButton: () => this.controls.lockStopButton(),
      startAnimation: (duration: number) => this.carView.animateMove(duration),
      stopAnimation: () => this.carView.stopMoving(),
      moveCarToStart: () => this.carView.moveCarToStart(),
      setCarStatus: (status: LabelType[keyof LabelType]) => this.carView.updateCarStateLabel(status),
    });
  }

  public animateMove(duration: number) {
    this.carView.animateMove(duration);
  }

  public stopMoving() {
    this.carView.stopMoving();
  }

  async remove() {
    await deleteCarByID(this.id);
    this.carView.destroy();
  }

  public updateCarStateLabel(label: LabelType[keyof LabelType]) {
    this.carView.updateCarStateLabel(label);
  }

  public getVieW() {
    return this.carView;
  }

  public getID() {
    return this.id;
  }
}

export default Car;
