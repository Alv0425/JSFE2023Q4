import "./car.css";
import type { ICarResponse } from "../../../types/response-interfaces";
import Component from "../../../utils/component";
import { div, span, svgSprite } from "../../../utils/elements";
import CarControls from "./car-controls";
import type { LabelType } from "../car-labels";
import LABELS from "../car-labels";

class CarView extends Component {
  private carImage: SVGSVGElement;

  private carTrack: Component<HTMLElement>;

  private nameLabel: Component<HTMLElement>;

  public controls: CarControls;

  private animationID = 0;

  private carStateLabel: Component<HTMLElement>;

  constructor(name: string, color: string) {
    super("div", ["car"], {}, {});
    this.controls = new CarControls();
    this.carImage = svgSprite("./assets/car/sedan.svg#car0", "car__image");
    this.carImage.style.setProperty("fill", color);
    this.nameLabel = span(["car__name"], name);
    this.carStateLabel = span(["car__state-label"], "");
    this.carTrack = div(["car__track"], this.carImage, div(["car__finish"]));
    this.updateCarStateLabel(LABELS.garage);
    this.appendContent([
      div(
        ["car__buttons"],
        this.controls.carEditButton,
        this.controls.carDeleteButton,
        this.nameLabel,
        this.carStateLabel,
      ),
      div(
        ["car__body"],
        div(["car__controls"], this.controls.carRunButton, this.controls.carStopButton),
        this.carTrack,
        div(["car__finish-place"]),
      ),
      div(["car__road"]),
    ]);
  }

  public updateView(params: ICarResponse): void {
    this.carImage.style.setProperty("fill", params.color);
    this.nameLabel = span(["car__name"], params.name);
  }

  public updateCarStateLabel(label: LabelType[keyof LabelType]): void {
    if (label === LABELS.finished && this.carStateLabel.getComponent().textContent === "winner") {
      return;
    }
    this.carStateLabel.setTextContent(label);
  }

  public animateMove(duration: number): void {
    if (duration) {
      this.updateCarStateLabel(LABELS.move);
    }
    if (!duration) {
      return;
    }
    const start = performance.now();
    const animate = (time: number): void => {
      let timeFr = (time - start) / duration;
      if (timeFr > 1) {
        timeFr = 1;
      }
      this.carImage.style.setProperty("left", `calc(${timeFr * 100}%)`);
      if (timeFr < 1) {
        this.animationID = requestAnimationFrame(animate);
      }
    };
    this.animationID = requestAnimationFrame(animate);
  }

  public stopMoving(): void {
    if (this.animationID) {
      cancelAnimationFrame(this.animationID);
    }
  }

  public moveCarToStart(): void {
    this.updateCarStateLabel(LABELS.garage);
    this.carImage.style.removeProperty("left");
  }
}

export default CarView;
