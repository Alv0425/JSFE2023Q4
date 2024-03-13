import { ILevel } from "../../utils/types/interfaces";

class DataHandler {
  private urlPrefix: string;

  public constructor() {
    this.urlPrefix =
      "https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/";
  }

  public async fetchLevelsData(level: number) {
    const fetchResponse: Response = await fetch(
      `./assets/data/wordCollectionLevel${level}.json`,
    );
    if (!fetchResponse.ok) throw new Error("Cannot read levels data");
    const levelData = (await fetchResponse.json()) as ILevel;
    return levelData;
  }

  public getImage(url: string) {
    return `${this.urlPrefix}images/${url}`;
  }
}

const dataHandler = new DataHandler();

export default dataHandler;
