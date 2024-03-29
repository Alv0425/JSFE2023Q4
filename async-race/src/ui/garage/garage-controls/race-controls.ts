import Component from "../../../utils/component";
import { button } from "../../../utils/elements";

class RaceControls extends Component {
  stopRaceButton: Component<HTMLButtonElement>;

  startRaceButton: Component<HTMLButtonElement>;

  constructor() {
    super("div", ["garage__control-race"]);
    this.startRaceButton = button(["garage__control-race-start"], "START RACE");
    this.stopRaceButton = button(["garage__control-race-stop"], "STOP RACE");
    this.appendContent([this.startRaceButton, this.stopRaceButton]);
  }
}

const raceControls = new RaceControls();

export default raceControls;
