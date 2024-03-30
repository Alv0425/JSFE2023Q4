import eventEmitter from "../../../services/event-emitter";
import Component from "../../../utils/component";

class GenerateCarsControl extends Component {
  constructor() {
    super("button", ["garage__control-generate"], {}, { type: "button" });
    this.setTextContent("GENERATE 100 CARS");
    this.addListener("click", () => eventEmitter.emit("generate-random-cars"));
  }
}

const generateCars = new GenerateCarsControl();

export default generateCars;
