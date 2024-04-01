import State from "../../services/state-manager/state";
import garageContent from "../../ui/garage/garage-pagination/garage-pages";
import { prepareCarsOnPage, resetRace, startRace } from "./race-actions";
import { IRaceParticipants } from "./race-interfaces";
import RACE_STATES from "./race-states";

class RaceManager extends State {
  public currentParticipants: IRaceParticipants[] = [];

  public currentPage: number = 1;

  public abortController: AbortController = new AbortController();

  constructor() {
    super({
      currentState: "all-cars-in-garage",
      states: RACE_STATES,
      callbacks: {
        "block-pagination-buttons": () => {},
        "prepare-cars": async () => {
          await this.prepareCars();
        },
        "on-engines": async () => {
          const cars: IRaceParticipants[] = this.getRaceParticipants();
          if (cars) await startRace(cars, this.abortController);
          this.emit("race-finish");
        },
        "stop-engines": () => {
          setTimeout(() => console.log(this.getCurrentState()), 0);
        },
        "unlock-pagination-buttons": () => {},
        restart: () => this.restartRace(),
        reset: () => {
          if (this.currentParticipants) resetRace(this.currentParticipants);
          this.abortController.abort("reset race");
        },
      },
    });
  }

  private async prepareCars(): Promise<void> {
    this.abortController = new AbortController();
    await this.setParticipants();
    this.emit("cars-prepared");
  }

  public async setParticipants(): Promise<void> {
    this.currentPage = garageContent.currentPageIndex;
    const raceParticipants: IRaceParticipants[] = await prepareCarsOnPage(this.currentPage + 1);
    this.currentParticipants = raceParticipants;
  }

  public getRaceParticipants(): IRaceParticipants[] {
    return this.currentParticipants;
  }

  private restartRace(): void {
    this.currentParticipants = [];
    this.abortController.abort();
    this.emit("start-race");
  }
}

const race = new RaceManager();

export default race;
