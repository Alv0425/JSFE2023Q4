import race from "../../../components/race-engine/race-manager";
import Component from "../../../utils/component";
import { button } from "../../../utils/elements";
import eventEmitter from "../../../utils/event-emitter";

class RaceControls extends Component {
  stopRaceButton: Component<HTMLButtonElement>;

  startRaceButton: Component<HTMLButtonElement>;

  constructor() {
    super("div", ["garage__control-race"]);
    this.startRaceButton = button(["garage__control-race-start"], "START RACE");
    this.stopRaceButton = button(["garage__control-race-stop"], "RESET RACE");
    this.appendContent([this.startRaceButton, this.stopRaceButton]);
    this.startRaceButton.addListener("click", () => race.emit("start-race"));
    this.stopRaceButton.addListener("click", () => race.emit("reset-race"));
    eventEmitter.on("race-started", () => this.lockStartButton());
    eventEmitter.on("reset-race", () => this.unlockStartButton());
  }

  private lockStartButton() {
    this.startRaceButton.getComponent().disabled = true;
  }

  private unlockStartButton() {
    this.startRaceButton.getComponent().disabled = false;
  }
}

const raceControls = new RaceControls();

export default raceControls;
