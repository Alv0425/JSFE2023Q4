import race from "../../../components/race-engine/race-manager";
import Component from "../../../utils/component";
import debounce from "../../../utils/debounce";
import { button } from "../../../utils/elements";
import eventEmitter from "../../../utils/event-emitter";

class RaceControls extends Component {
  private stopRaceButton: Component<HTMLButtonElement>;

  private startRaceButton: Component<HTMLButtonElement>;

  constructor() {
    super("div", ["garage__control-race"]);
    this.startRaceButton = button(["garage__control-race-start"], "START RACE");
    this.stopRaceButton = button(["garage__control-race-stop"], "RESET RACE");
    this.appendContent([this.startRaceButton, this.stopRaceButton]);
    this.startRaceButton.addListener("click", () => eventEmitter.emit("start-race"));
    this.stopRaceButton.addListener("click", () => this.resetRaceHandler());
    eventEmitter.on("race-started", () => this.lockStartButton());
  }

  private lockStartButton(): void {
    this.startRaceButton.getComponent().disabled = true;
  }

  private unlockStartButton(): void {
    this.startRaceButton.getComponent().disabled = false;
  }

  private resetRaceHandler(): void {
    debounce(() => {
      race.emit("reset-race");
      this.unlockStartButton();
    }, 1000)();
  }
}

const raceControls = new RaceControls();

export default raceControls;
