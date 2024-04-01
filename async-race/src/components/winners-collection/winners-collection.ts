import eventEmitter from "../../utils/event-emitter";
import Pagination from "../../services/pagination-service/pagination";
import getWinners, { getWinnerByID } from "../../services/api/get-winners";
import Winner from "../winner/winner";
import deleteWinnerByID from "../../services/api/delete-winner";
import { IRaceParticipants } from "../race-engine/race-interfaces";
import { IWinnerResponse, IWinnersInfoResponse } from "../../services/api/response-interfaces";
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
    eventEmitter.on("change-sort-win", async () => {
      await this.sortBy("wins");
    });
    eventEmitter.on("change-sort-time", async () => {
      await this.sortBy("time");
    });
  }

  async sortBy(order: "time" | "wins") {
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

  async removeWinner(id: number) {
    const index = this.collection.findIndex((winner) => winner.getID() === id);
    if (index === -1) return;
    this.collection[index].destroy();
    await deleteWinnerByID(id);
    this.removeItem(index);
    eventEmitter.emit("winner-removed");
  }

  async reloadWinnersCollection() {
    const winners = await getWinners(this.sortOptions);
    const winnersComponents = winners.map((winner, index) => new Winner(winner, index + 1));
    this.collection = winnersComponents;
  }

  async addWinner(winnerInfo: IRaceParticipants) {
    const index = this.collection.findIndex((winner) => winner.getID() === winnerInfo.carInfo.id);
    const winnerAPI = await getWinnerByID(winnerInfo.carInfo.id);
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
      const winner = new Winner(params, this.collection.length + 1);
      await addWinner(winnerResult);
      this.collection.push(winner);
      eventEmitter.emit("winner-created");
    } else {
      this.collection[index].updateWinnerResult(winnerInfo, index + 1);
      if (winnerAPI.time > winnerResult.time) winnerAPI.time = winnerResult.time;
      winnerAPI.wins += 1;
      await updateWinner(winnerAPI);
      eventEmitter.emit("winner-created");
    }
  }
}

const winnersCollection = new WinnersCollection();

export default winnersCollection;
