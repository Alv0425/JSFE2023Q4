import { getCarByID } from "../../../services/api/get-cars";
import eventEmitter from "../../../services/event-emitter";
import Component from "../../../utils/component";
import { button, input } from "../../../utils/elements";

class ControlUpdate extends Component {
  input: Component<HTMLInputElement>;

  color: Component<HTMLInputElement>;

  button: Component<HTMLButtonElement>;

  constructor() {
    super("form", ["garage__control-update"], {}, { action: "" });
    this.input = input(["garage__control-input"], { type: "text", value: "" });
    this.color = input(["garage__control-color"], { type: "color", value: "#000" });
    this.button = button(["garage__control-button"], "UPDATE");
    this.appendContent([this.input, this.color, this.button]);
    this.button.addListener("click", async () => {
      if (this.getId() === "") return;
      const car = await getCarByID(parseInt(this.getId(), 10));
      if (car.name) eventEmitter.emit("edit-car");
      if (!car.name) console.log("Select another car to edit!");
    });
  }

  getId() {
    return this.button.getComponent().value;
  }

  getColor() {
    return this.color.getComponent().value;
  }

  getName() {
    return this.input.getComponent().value;
  }

  setProps(id: number, name: string, color: string) {
    this.button.getComponent().value = `${id}`;
    this.input.getComponent().value = name;
    this.color.getComponent().value = color;
  }

  resetInputs() {
    this.button.getComponent().value = "";
    this.input.getComponent().value = "";
    this.color.getComponent().value = "#000000";
  }
}

const controlUpdate = new ControlUpdate();

export default controlUpdate;
