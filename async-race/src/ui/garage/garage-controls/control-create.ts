import Component from "../../../utils/component";
import { button, input } from "../../../utils/elements";

class ControlCreate extends Component {
  input: Component<HTMLInputElement>;

  color: Component<HTMLInputElement>;

  button: Component<HTMLButtonElement>;

  constructor() {
    super("form", ["garage__control-create"], {}, { action: "" });
    this.input = input(["garage__control-input"], { type: "text", value: "" });
    this.color = input(["garage__control-color"], { type: "color", value: "#000" });
    this.button = button(["garage__control-button"], "CREATE");
    this.appendContent([this.input, this.color, this.button]);
  }
}

const controlCreate = new ControlCreate();

export default controlCreate;
