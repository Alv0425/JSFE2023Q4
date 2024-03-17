import eventEmitter from "../../utils/eventemitter";
import { IRoundResult, IStorage } from "../../utils/types/interfaces";
import dataHandler from "./datahandler";

class LocalStorage {
  private templateData: IStorage;

  private key: string;

  public constructor() {
    this.templateData = {
      hintsOptions: {
        imageHint: true,
        audioHint: true,
        translationHint: true,
      },
      firstName: "",
      surname: "",
      stats: {},
      lastRound: {
        level: 1,
        round: -1,
      },
      currentRound: {
        level: 1,
        round: 0,
      },
    };
    this.key = "alv0425-rss-pz";
    eventEmitter.on("logout", () => this.clearStorage());
  }

  public checkFirstLoad() {
    if (!Object.prototype.hasOwnProperty.call(localStorage, this.key)) {
      localStorage.setItem(this.key, JSON.stringify(this.templateData));
    }
  }

  private clearStorage() {
    this.saveLoginData(this.templateData);
  }

  public saveLoginData(data: IStorage) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  public getData() {
    const data = localStorage.getItem(this.key);
    let dataObj: IStorage = this.templateData;
    if (data) dataObj = JSON.parse(data);
    return dataObj;
  }

  public getName() {
    const data = this.getData();
    return `${data.firstName} ${data.surname}`;
  }

  public getHintOptions() {
    const data = this.getData();
    return data.hintsOptions;
  }

  public setHintOptions({ imageHint, audioHint, translationHint }: Record<string, boolean>) {
    const data = this.getData();
    data.hintsOptions.imageHint = imageHint;
    data.hintsOptions.audioHint = audioHint;
    data.hintsOptions.translationHint = translationHint;
    this.saveLoginData(data);
  }

  public getRoundStats(roundId: string) {
    const data = this.getData();
    if (!data.stats) return null;
    if (!data.stats[roundId]) return null;
    return data.stats[roundId];
  }

  public async checkLevelCompletion(level: number) {
    const data = this.getData();
    const levelData = await dataHandler.fetchLevelsData(level);
    if (!data.stats) return false;
    const arrayID = levelData.rounds.map((round) => round.levelData.id);
    return arrayID.every((id) => {
      if (data.stats) return data.stats[id];
      return false;
    });
  }

  public setRoundStats(result: IRoundResult, roundId: string) {
    const data = this.getData();
    if (!data.stats) return;
    data.stats[roundId] = result;
    this.saveLoginData(data);
  }

  public getLastCompletedRound() {
    const data = this.getData();
    if (!data.lastRound) return null;
    if (!data.lastRound) return null;
    return data.lastRound;
  }

  public setLastCompletedRound(level: number, round: number) {
    const data = this.getData();
    if (!data.lastRound) return;
    data.lastRound = { level, round };
    this.saveLoginData(data);
  }

  public getCurrentRound() {
    const data = this.getData();
    if (!data.currentRound) return null;
    if (!data.currentRound) return null;
    return data.currentRound;
  }

  public setCurrentRound(level: number, round: number) {
    const data = this.getData();
    if (!data.currentRound) return;
    data.currentRound = { level, round };
    this.saveLoginData(data);
  }
}

const storage = new LocalStorage();

export default storage;
