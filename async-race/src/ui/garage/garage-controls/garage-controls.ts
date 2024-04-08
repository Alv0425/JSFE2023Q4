import "./garage-controls.css";
import Component from "../../../utils/component";
import controlCreate from "./control-create";
import generateCars from "./generate-cars";
import raceControls from "./race-controls";

class GarageControls extends Component {
  constructor() {
    super("div", ["garage__controls"], {}, {}, controlCreate, generateCars, raceControls);
  }
}

const garageControls = new GarageControls();

export default garageControls;
