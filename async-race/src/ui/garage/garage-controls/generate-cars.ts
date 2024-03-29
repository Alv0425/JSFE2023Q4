import Component from "../../../utils/component";

class GenerateCarsControl extends Component {
  constructor() {
    super("button", ["garage__control-generate"], {}, { type: "button" });
    this.setTextContent("Genetate 100 cars");
  }
}

const generateCars = new GenerateCarsControl();

export default generateCars;
