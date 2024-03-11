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
  }

  public checkFirstLoad() {
    if (!Object.prototype.hasOwnProperty.call(localStorage, this.key)) {
      localStorage.setItem(this.key, JSON.stringify(this.templateData));
    }
    if (!this.getData().firstName) console.log("sdfsdf");
  }

  public saveData() {}

  public getData() {
    const data = localStorage.getItem(this.key);
    let dataObj: IStorage = {};
    if (data) dataObj = JSON.parse(data);
    return dataObj;
  }
}

const storage = new LocalStorage();

export default storage;
