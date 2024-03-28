import { ICarResponse, IEngineStatusResponse } from "../../services/api/response-interfaces";
import State from "../../services/state-manager/state";
import { prepareCarsOnPage, startRace } from "./race-actions";
import RACE_STATES from "./race-states";

class RaceManager extends State {
  public currentParticipants: {
    carInfo: ICarResponse;
    raceParams: IEngineStatusResponse;
  }[] = [];

  public abortController: AbortController = new AbortController();

  constructor() {
    super({
      currentState: "all-cars-in-garage",
      states: RACE_STATES,
      callbacks: {
        "block-pagination-buttons": () => {},
        "prepare-cars": async () => {
          const raceParticipants = await prepareCarsOnPage(1);
          this.abortController = new AbortController();
          this.setRaceParticipants(raceParticipants);
          this.emit("cars-prepared");
        },
        "on-engines": async () => {
          const cars = this.getRaceParticipants();
          if (cars) await startRace(cars, this.abortController);
          this.emit("race-finish");
        },
        "stop-engines": () => {
          setTimeout(() => console.log(this.getCurrentState()), 0);
        },
        "unlock-pagination-buttons": () => {},
        "restart-race": () => {
          this.currentParticipants = [];
          this.abortController.abort();
          // move all cars to the start
          // setTimeout(() => this.emit('start-race'), 0);
        },
        reset: () => {
          // move all cars to start
          // stop all cars animations
        },
      },
    });
  }

  public setRaceParticipants(
    cars: {
      carInfo: ICarResponse;
      raceParams: IEngineStatusResponse;
    }[],
  ) {
    this.currentParticipants = cars;
  }

  public getRaceParticipants() {
    return this.currentParticipants;
  }
}

const race = new RaceManager();

export default race;
