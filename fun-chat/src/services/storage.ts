import AuthController from "../controllers/auth-controller";
import eventEmitter from "../utils/event-emitter/event-emitter";
import { EventsMap } from "../utils/event-emitter/events";

interface IStorage {
  isLoggedIn: boolean;
  user: {
    login: string;
    password: string;
  };

  lastVisitedPage: "/login" | "/about" | "/main";
}

class SessionStorage {
  private key: string;

  private templateData: IStorage;

  constructor() {
    this.templateData = {
      isLoggedIn: false,
      user: {
        login: "",
        password: "",
      },
      lastVisitedPage: "/login",
    };
    this.key = "alv0425-fun-chat";
    this.checkFirstLoad();
    eventEmitter.on(EventsMap.logout, () => this.resetData());
    eventEmitter.on(EventsMap.login, () => {
      const currentState = this.getData();
      currentState.isLoggedIn = true;
      currentState.user = AuthController.currentUserData;
      this.saveLoginData(currentState);
    });
    AuthController.setUserData(this.getData().user.login, this.getData().user.password);
  }

  public checkFirstLoad(): void {
    if (!Object.prototype.hasOwnProperty.call(sessionStorage, this.key)) {
      sessionStorage.setItem(this.key, JSON.stringify(this.templateData));
    }
  }

  public resetData(): void {
    sessionStorage.setItem(this.key, JSON.stringify(this.templateData));
  }

  public saveLoginData(data: IStorage): void {
    sessionStorage.setItem(this.key, JSON.stringify(data));
  }

  public getData(): IStorage {
    const data: string | null = sessionStorage.getItem(this.key);
    let dataObj: IStorage = this.templateData;
    if (data) {
      dataObj = JSON.parse(data);
    }
    return dataObj;
  }

  public getLogin(): string {
    const data: IStorage = this.getData();
    return `${data.user.login}`;
  }

  public getPassword(): string {
    const data: IStorage = this.getData();
    return `${data.user.password}`;
  }

  public isLoggedIn(): boolean {
    const data: IStorage = this.getData();
    return data.isLoggedIn;
  }

  public getPath(): string {
    const data: IStorage = this.getData();
    return `${data.lastVisitedPage}`;
  }
}

const storage = new SessionStorage();

export default storage;
