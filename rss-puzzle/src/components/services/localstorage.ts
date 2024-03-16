import eventEmitter from "../../utils/eventemitter";
import { IStorage } from "../../utils/types/interfaces";

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
}

const storage = new LocalStorage();

export default storage;
