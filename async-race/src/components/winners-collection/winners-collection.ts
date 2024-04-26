import eventEmitter from "../../utils/event-emitter";
import Pagination from "../../services/pagination-service/pagination";
import getWinners, { getWinnerByID } from "../../services/api/get-winners";
import Winner from "../winner/winner";
import deleteWinnerByID from "../../services/api/delete-winner";
import type { IRaceParticipants } from "../race-engine/race-interfaces";
import type { IWinnerResponse, IWinnersInfoResponse } from "../../types/response-interfaces";
import addWinner from "../../services/api/add-winner";
import updateWinner from "../../services/api/update-winner";

class WinnersCollection extends Pagination<Winner> {
  private sortOptions: {
    sort: "id" | "wins" | "time";
    order: "ASC" | "DESC";
  } = {
    sort: "time",
    order: "ASC",
  };

  constructor() {
    super([], 10);
    eventEmitter.on("winner-created", () => {
      this.reloadWinnersCollection();
      eventEmitter.emit("winners-collection-changed");
    });
    eventEmitter.on("car-removed", () => {
      this.reloadWinnersCollection();
      eventEmitter.emit("winners-collection-changed");
    });
    eventEmitter.on("car-edited", () => {
      this.reloadWinnersCollection();
      eventEmitter.emit("winners-collection-changed");
    });
    eventEmitter.on("change-sort-win", async () => {
      await this.sortBy("wins");
    });
    eventEmitter.on("change-sort-time", async () => {
      await this.sortBy("time");
    });
  }

  public async sortBy(order: "time" | "wins"): Promise<void> {
    if (this.sortOptions.sort === order) {
      this.sortOptions.order = this.sortOptions.order === "ASC" ? "DESC" : "ASC";
    } else {
      this.sortOptions.sort = order;
      this.sortOptions.order = "ASC";
    }
    await this.reloadWinnersCollection();
    eventEmitter.emit("winners-collection-changed");
    if (this.sortOptions.order === "ASC") {
      eventEmitter.emit(`winners-sorted-asc-${order}`);
    } else {
      eventEmitter.emit(`winners-sorted-desc-${order}`);
    }
  }

  public async removeWinner(id: number): Promise<void> {
    const index = this.collection.findIndex((winner) => winner.getID() === id);
    if (index === -1) {
      return;
    }
    this.collection[index].destroy();
    await deleteWinnerByID(id);
    this.removeItem(index);
    eventEmitter.emit("winner-removed");
  }

  public async reloadWinnersCollection(): Promise<void> {
    const winners = await getWinners(this.sortOptions);
    const winnersComponents = winners.map((winner, index) => new Winner(winner, index + 1));
    this.collection = winnersComponents;
  }

  public async addWinner(winnerInfo: IRaceParticipants): Promise<void> {
    const index: number = this.collection.findIndex((winner) => winner.getID() === winnerInfo.carInfo.id);
    const winnerAPI: IWinnerResponse = await getWinnerByID(winnerInfo.carInfo.id);
    const winnerResult: IWinnerResponse = {
      id: winnerInfo.carInfo.id,
      wins: 1,
      time: Math.round(winnerInfo.raceParams.distance / winnerInfo.raceParams.velocity) / 1000,
    };
    if (index === -1) {
      const params: IWinnersInfoResponse = {
        ...winnerResult,
        color: winnerInfo.carInfo.color,
        name: winnerInfo.carInfo.name,
      };
      const addWinnerResponse: IWinnerResponse = await addWinner(winnerResult);
      if (addWinnerResponse.error) {
        return;
      }
      const winner: Winner = new Winner(params, this.collection.length + 1);
      this.collection.push(winner);
      eventEmitter.emit("winner-created");
    } else {
      this.collection[index].updateWinnerResult(winnerInfo, index + 1);
      if (winnerAPI.time > winnerResult.time) {
        winnerAPI.time = winnerResult.time;
      }
      winnerAPI.wins += 1;
      const updateWinnerResponse = await updateWinner(winnerAPI);
      if (!updateWinnerResponse.error) {
        eventEmitter.emit("winner-created");
      }
    }
  }
}

const winnersCollection = new WinnersCollection();

export default winnersCollection;