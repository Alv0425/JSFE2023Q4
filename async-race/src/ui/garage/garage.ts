import "./garage.css";
import Component from "../../utils/component";
import { h2 } from "../../utils/elements";
import garageControls from "./garage-controls/garage-controls";

class Garage extends Component {
  constructor() {
    super("div", ["garage"], {}, {}, h2(["garage__title"], "GARAGE"), garageControls);
  }

  public render() {
    document.body.append(this.getComponent());
  }
}

const garage = new Garage();

export default garage;
