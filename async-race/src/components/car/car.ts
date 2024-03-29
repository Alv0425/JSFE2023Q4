import "./car.css";
import Component from "../../utils/component";
import { div, span, svgSprite } from "../../utils/elements";
import CarEngine from "./car-engine";
import CarControls from "./car-controls";

export interface ICarOptions {
  color: string;
  name: string;
  id?: number;
}

class Car extends Component {
  private engine = new CarEngine(this.id);

  carImage: SVGSVGElement;

  carTrack: Component<HTMLElement>;

  nameLabel: Component<HTMLElement>;

  public animationID: number = 0;

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
      ),
      div(["car__road"]),
    ]);
    this.engine.setCarTrack(this.carTrack);
    this.engine.setCar(this.carImage);
    this.engine.on({
      onmoveControls: () => this.controls.lockControlsOnMove(),
      unlockAllControls: () => this.controls.unlockAllControls(),
      lockStopButton: () => this.controls.lockStopButton(),
      startAnimation: (duration: number) => this.animateMove(duration),
      stopAnimation: () => this.stopMoving(),
    });
    this.controls.carRunButton.addListener("click", () => this.runCar());
    this.controls.carStopButton.addListener("click", () => this.stopCar());
  }

  public animateMove(duration: number) {
    const start = performance.now();
    const animate = (time: number) => {
      const trackLength = this.carTrack.getSize().width - 170;
      let timeFr = (time - start) / duration;
      if (timeFr > 1) timeFr = 1;
      this.carImage.style.setProperty("transform", `translateX(${Math.round(timeFr * trackLength)}px)`);
      if (timeFr < 1) this.animationID = requestAnimationFrame(animate);
    };
    this.animationID = requestAnimationFrame(animate);
  }

  public stopMoving() {
    if (this.animationID) cancelAnimationFrame(this.animationID);
    this.moveCarToStart();
  }

  public moveCarToStart() {
    this.carImage.style.removeProperty("transform");
  }

  public async runCar() {
    this.engine.emit("start-car");
  }

  public stopCar() {
    this.engine.emit("reset");
  }
}

export default Car;
