import eventEmitter from "../../utils/eventemitter";
import { IStorage } from "../../utils/types/interfaces";

class LocalStorage {
  private templateData: IStorage;

  private key: string;

  public constructor() {
    this.templateData = {
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
    let dataObj: IStorage = {};
    if (data) dataObj = JSON.parse(data);
    return dataObj;
  }
}

const storage = new LocalStorage();

export default storage;
