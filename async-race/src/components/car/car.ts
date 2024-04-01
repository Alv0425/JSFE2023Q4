import "./car.css";
import Component from "../../utils/component";
import { div, span, svgSprite } from "../../utils/elements";
import CarEngine from "./car-engine";
import CarControls from "./car-controls";
import controlUpdate from "../../ui/garage/garage-controls/update-control";
import eventEmitter from "../../utils/event-emitter";
import updateCar from "../../services/api/update-car";
import { setEngineStatus } from "../../services/api/set-engine-status";

class Car extends Component {
  public engine = new CarEngine(this.id);

  carImage: SVGSVGElement;

  carTrack: Component<HTMLElement>;

  nameLabel: Component<HTMLElement>;

  private animationID: number = 0;

  controls: CarControls;

  constructor(
    private id: number,
    private name: string,
    private color: string,
  ) {
    super("div", ["car"], {}, {});
    this.controls = new CarControls();
    this.carImage = svgSprite("./assets/car/sedan.svg#car0", "car__image");
    this.carImage.style.setProperty("fill", this.color);
    this.nameLabel = span(["car__name"], this.name);
    this.carTrack = div(["car__track"], this.carImage, div(["car__finish"]));
    this.appendContent([
      div(["car__buttons"], this.controls.carEditButton, this.controls.carDeleteButton, this.nameLabel),
      div(
        ["car__body"],
        div(["car__controls"], this.controls.carRunButton, this.controls.carStopButton),
        this.carTrack,
        div(["car__finish-place"]),
      ),
      div(["car__road"]),
    ]);
    this.engine.on({
      onmoveControls: () => this.controls.lockControlsOnMove(),
      unlockAllControls: () => this.controls.unlockAllControls(),
      lockStopButton: () => this.controls.lockStopButton(),
      startAnimation: (duration: number) => this.animateMove(duration),
      stopAnimation: () => this.stopMoving(),
      moveCarToStart: () => this.moveCarToStart(),
    });
    this.controls.carRunButton.addListener("click", () => this.engine.emit("start-car"));
    this.controls.carStopButton.addListener("click", () => this.engine.emit("reset"));
    this.controls.carEditButton.addListener("click", () => this.editCar());
  }

  public editCar() {
    controlUpdate.setProps(this.id, this.name, this.color);
    eventEmitter.once("edit-car", async () => {
      if (controlUpdate.getId() !== `${this.id}`) return;
      this.name = controlUpdate.getName();
      this.color = controlUpdate.getColor();
      await updateCar({ name: this.name, color: this.color, id: this.id });
      this.nameLabel.setTextContent(this.name);
      this.carImage.style.setProperty("fill", this.color);
      controlUpdate.resetInputs();
    });
  }

  public animateMove(duration: number) {
    const start = performance.now();
    const animate = (time: number) => {
      let timeFr = (time - start) / duration;
      if (timeFr > 1) timeFr = 1;
      this.carImage.style.setProperty("left", `calc(${timeFr * 100}%)`);
      if (timeFr < 1) this.animationID = requestAnimationFrame(animate);
    };
    this.animationID = requestAnimationFrame(animate);
  }

  public stopMoving() {
    if (this.animationID) cancelAnimationFrame(this.animationID);
  }

  public moveCarToStart() {
    this.carImage.style.removeProperty("left");
  }

  public async resetMoving() {
    await setEngineStatus(this.id, "stopped");
    this.stopMoving();
    this.moveCarToStart();
    this.controls.lockStopButton();
    this.engine.emit("reset");
  }

  public getID() {
    return this.id;
  }
}

export default Car;
