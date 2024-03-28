import Component from "../../utils/component";
import { div } from "../../utils/elements";
import CarEngine from "./car-engine";

export interface ICarOptions {
  color: string;
  name: string;
  id?: number;
}

class Car extends Component {
  private engine = new CarEngine(this.id);

  private carButtonsContainer: Component<HTMLElement>;

  carBody: Component<HTMLElement>;

  constructor(private id: number) {
    super("div", ["car"]);
    this.carButtonsContainer = div(["car__buttons"], div(["car__road"]));
    this.carBody = div(["car__buttons"]);
  }
}

export default Car;
