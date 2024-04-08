import State from "../../services/state-manager/state";
import garageContent from "../../ui/garage/garage-pagination/garage-pages";
import eventEmitter from "../../utils/event-emitter";
import prepareCarsOnPage from "./race-actions/prepare-cars-on-page";
import resetRace from "./race-actions/reset-race";
import startRace from "./race-actions/start-race";
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
        "prepare-cars": async () => {
          await this.prepareCars();
        },
        "on-engines": async () => {
          const cars: IRaceParticipants[] = this.getRaceParticipants();
          if (cars) await startRace(cars, this.abortController);
        },
        restart: () => this.restartRace(),
        reset: async () => {
          await this.reset();
        },
        "race-end": () => console.log("race ended"),
      },
    });
    eventEmitter.on("race-ended", () => this.emit("race-finish"));
    eventEmitter.on("start-race", () => this.emit("start-race"));
    eventEmitter.on("reset-race", () => {
      this.currentParticipants = [];
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

  private async reset() {
    if (this.currentParticipants.length) {
      this.abortController.abort("reset race");
      await resetRace(this.currentParticipants);
    } else {
      eventEmitter.emit("reset-race-clicked");
    }
  }
}

const race = new RaceManager();

export default race;
