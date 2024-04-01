import eventEmitter from "../../utils/eventemitter";
import {
  ICurrentRoundStats,
  IHintsOptions,
  ILevel,
  IRound,
  IRoundLevelInfo,
  IRoundResult,
  IStorage,
} from "../../utils/types/interfaces";
import dataHandler from "./datahandler";

class LocalStorage {
  private templateData: IStorage;

  private key: string;

  constructor() {
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
      currentRoundStats: {},
    };
    this.key = "alv0425-rss-pz";
    eventEmitter.on("logout", () => this.clearStorage());
  }

  public checkFirstLoad(): void {
    if (!Object.prototype.hasOwnProperty.call(localStorage, this.key)) {
      localStorage.setItem(this.key, JSON.stringify(this.templateData));
    }
  }

  private clearStorage(): void {
    this.saveLoginData(this.templateData);
  }

  public saveLoginData(data: IStorage): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  public getData(): IStorage {
    const data: string | null = localStorage.getItem(this.key);
    let dataObj: IStorage = this.templateData;
    if (data) dataObj = JSON.parse(data);
    return dataObj;
  }

  public getName(): string {
    const data: IStorage = this.getData();
    return `${data.firstName} ${data.surname}`;
  }

  public getHintOptions(): IHintsOptions {
    const data: IStorage = this.getData();
    return data.hintsOptions;
  }

  public setHintOptions({ imageHint, audioHint, translationHint }: IHintsOptions): void {
    const data: IStorage = this.getData();
    data.hintsOptions.imageHint = imageHint;
    data.hintsOptions.audioHint = audioHint;
    data.hintsOptions.translationHint = translationHint;
    this.saveLoginData(data);
  }

  public getRoundStats(roundId: string): IRoundResult | null {
    const data: IStorage = this.getData();
    if (!data.stats) return null;
    if (!data.stats[roundId]) return null;
    return data.stats[roundId];
  }

  public async checkLevelCompletion(level: number): Promise<boolean> {
    const data: IStorage = this.getData();
    const levelData: ILevel = await dataHandler.fetchLevelsData(level);
    if (!data.stats) return false;
    const arrayID: string[] = levelData.rounds.map((round) => round.levelData.id);
    return arrayID.every((id) => {
      if (data.stats) return data.stats[id];
      return false;
    });
  }

  public setRoundStats(result: IRoundResult, roundId: string): void {
    const data = this.getData();
    if (!data.stats) return;
    data.stats[roundId] = result;
    this.saveLoginData(data);
  }

  public getLastCompletedRound(): IRoundLevelInfo | null {
    const data = this.getData();
    if (!data.lastRound) return null;
    if (!data.lastRound) return null;
    return data.lastRound;
  }

  public setLastCompletedRound(level: number, round: number): void {
    const data: IStorage = this.getData();
    if (!data.lastRound) return;
    data.lastRound = { level, round };
    this.saveLoginData(data);
  }

  public getCurrentRound(): IRoundLevelInfo | null {
    const data: IStorage = this.getData();
    if (!data.currentRound) return null;
    if (!data.currentRound) return null;
    return data.currentRound;
  }

  public setCurrentRound(level: number, round: number): void {
    const data: IStorage = this.getData();
    if (!data.currentRound) return;
    data.currentRound = { level, round };
    this.saveLoginData(data);
  }

  public setCurrentRoundStats(result: IRoundResult, roindInfo: IRound): void {
    const data: IStorage = this.getData();
    if (!data.currentRoundStats) return;
    data.currentRoundStats.currentStats = result;
    data.currentRoundStats.roundInfo = roindInfo;
    this.saveLoginData(data);
  }

  public getCurrentRoundStats(): ICurrentRoundStats | null {
    const data: IStorage = this.getData();
    if (!data.currentRoundStats) return null;
    if (!data.currentRoundStats) return null;
    return data.currentRoundStats;
  }
}

const storage = new LocalStorage();

export default storage;
