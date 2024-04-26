import eventEmitter from "../utils/event-emitter/event-emitter";
import StateMachine from "../utils/state-machine/state-machine";
import VIEW_STATES from "./routes-states";
import { EventsMap } from "../utils/event-emitter/events";
import pageWrapper from "../view/page-wrapper/page-wrapper";
import storage from "../services/storage";
import waitScreen from "../view/wait-screen/wait-screen";

class Router extends StateMachine {
  private routes: Map<string, () => void> = new Map();

  constructor() {
    super({
      currentState: "not-authorized",
      states: VIEW_STATES,
      callbacks: {
        "render-login-page": () => pageWrapper.openLogin(),
        "redirect-to-login-page": () => this.navigateTo("/login"),
        "render-notfound-page": () => pageWrapper.openNotFound(),
        "render-main-page": () => pageWrapper.openMain(),
        "redirect-to-main-page": () => this.navigateTo("/main"),
        "render-about-page": () => pageWrapper.openAbout(),
        "manage-reload-when-authohized": () => this.navigate(),
      },
    });
    this.generateRoutes();
    window.addEventListener("popstate", () => this.navigate());
    let isTabClosing = false;
    window.addEventListener("beforeunload", () => {
      isTabClosing = true;
    });
    if (storage.isLoggedIn()) {
      waitScreen.openWaitLogin();
    }
    window.addEventListener("unload", () => {
      if (isTabClosing) {
        eventEmitter.emit(EventsMap.loginOut);
      }
    });
    eventEmitter.on(EventsMap.aboutOpen, () => this.navigateTo("/about"));
    eventEmitter.on(EventsMap.initial, () => this.navigateTo("/"));
    eventEmitter.on(EventsMap.login, () => this.emit("login"));
    eventEmitter.on(EventsMap.logout, () => this.emit("logout"));
  }

  public init(): void {
    pageWrapper.render();
    this.navigate();
  }

  public navigate(): void {
    let path: string = window.location.pathname.toLowerCase() || "/";
    if (!this.routes.has(path)) {
      path = "/not-found";
    }
    this.navigateTo(path);
  }

  public navigateTo(path: string): void {
    const redirectTo: (() => void) | undefined = this.routes.get(path);
    window.history.pushState(null, "", path);
    if (redirectTo) {
      redirectTo();
    }
  }

  private generateRoutes(): void {
    this.routes = new Map([
      ["/", (): void => this.emit("load")],
      ["/about", (): void => this.emit("about")],
      ["/login", (): void => this.emit("access-login-page")],
      ["/main", (): void => this.emit("access-main-page")],
      ["/not-found", (): void => this.emit("not-found")],
    ]);
  }
}

const router = new Router();

export default router;
