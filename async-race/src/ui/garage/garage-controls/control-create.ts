import createCar from "../../../services/api/create-car";
import eventEmitter from "../../../utils/event-emitter";
import Component from "../../../utils/component";
import { button, div, input, svgSprite } from "../../../utils/elements";

class ControlCreate extends Component {
  input: Component<HTMLInputElement>;

  color: Component<HTMLInputElement>;

  button: Component<HTMLButtonElement>;

  carIMG: SVGSVGElement;

  constructor() {
    super("form", ["garage__control-create"], {}, { action: "" });
    this.carIMG = svgSprite("./assets/car/sedan.svg#car0", "garage__control-create-preview");
    this.input = input(["garage__control-input"], { type: "text", value: "" });
    this.color = input(["garage__control-color"], { type: "color", value: "#ffc857" });
    this.applyColor();
    this.color.addListener("input", () => this.applyColor());
    this.button = button(["garage__control-button"], "CREATE");
    this.appendContent([this.carIMG, div(["garage__control-create-inputs"], this.input, this.color, this.button)]);
    this.button.addListener("click", async () => {
      if (this.input.getComponent().value === "") return;
      await createCar({
        name: this.input.getComponent().value,
        color: this.color.getComponent().value,
      });
      eventEmitter.emit("car-created");
    });
  }

  public applyColor() {
    this.carIMG.style.fill = this.color.getComponent().value;
  }
}

const controlCreate = new ControlCreate();

export default controlCreate;
