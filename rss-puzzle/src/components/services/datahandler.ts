import { isObject } from "../../utils/helpers/getelementoftype";
import { ILevel } from "../../utils/types/interfaces";

class DataHandler {
  private urlPrefix: string;

  public constructor() {
    this.urlPrefix = "https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/";
  }

  public async fetchLevelsData(level: number): Promise<ILevel> {
    try {
      const fetchResponse: Response = await fetch(`./assets/data/wordCollectionLevel${level}.json`);
      if (!fetchResponse.ok) throw new Error("Cannot read levels data");
      const levelData: unknown = await fetchResponse.json();
      if (!isObject(levelData)) throw new Error("Cannot read levels data");
      if (!Object.keys(levelData as Record<string, unknown>).includes("roundsCount"))
        throw new Error("Cannot read levels data");
      return levelData as ILevel;
    } catch (e) {
      throw new Error("Cannot read levels data");
    }
  }

  public getImageUrl(url: string): string {
    return `${this.urlPrefix}images/${url}`;
  }

  public getAudioUrl(url: string): string {
    return `${this.urlPrefix}${url}`;
  }
}

const dataHandler = new DataHandler();

export default dataHandler;
