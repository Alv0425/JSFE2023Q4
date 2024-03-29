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
  }
}

const controlUpdate = new ControlUpdate();

export default controlUpdate;
