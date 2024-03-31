import { ICarResponse, IEngineStatusResponse } from "../../services/api/response-interfaces";
import State from "../../services/state-manager/state";
import garageContent from "../../ui/garage/garage-pagination/garage-pages";
import Car from "../car/car";
import { prepareCarsOnPage, resetRace, startRace } from "./race-actions";
import RACE_STATES from "./race-states";

class RaceManager extends State {
  public currentParticipants: {
    carInfo: ICarResponse;
    raceParams: IEngineStatusResponse;
  }[] = [];

  public currentCars: Car[] | null = null;

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
          const cars = this.getRaceParticipants();
          if (cars && this.currentCars) await startRace(cars, this.currentCars, this.abortController);
          this.emit("race-finish");
        },
        "stop-engines": () => {
          setTimeout(() => console.log(this.getCurrentState()), 0);
        },
        "unlock-pagination-buttons": () => {},
        restart: () => this.restartRace(),
        reset: () => {
          if (this.currentParticipants && this.currentCars) resetRace(this.currentParticipants, this.currentCars);
          this.abortController.abort("reset race");
        },
      },
    });
  }

  private async prepareCars() {
    this.abortController = new AbortController();
    await this.setParticipants();
    this.currentCars?.forEach((car, idx) => {
      const { raceParams } = this.currentParticipants[idx];
      car.animateMove(raceParams.distance / raceParams.velocity);
      car.controls.lockAllControls();
    });
    this.emit("cars-prepared");
  }

  public setRaceParticipants(
    cars: {
      carInfo: ICarResponse;
      raceParams: IEngineStatusResponse;
    }[],
  ) {
    this.currentParticipants = cars;
  }

  public async setParticipants() {
    this.currentPage = garageContent.currentPageIndex;
    this.currentCars = garageContent.currentCars;
    const raceParticipants = await prepareCarsOnPage(this.currentPage + 1);
    this.currentParticipants = raceParticipants;
  }

  public getRaceParticipants() {
    return this.currentParticipants;
  }

  private restartRace() {
    this.currentParticipants = [];
    this.abortController.abort();
    this.emit("start-race");
  }
}

const race = new RaceManager();

export default race;
