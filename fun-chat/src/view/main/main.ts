import Component from "../../utils/component/component";
import AboutContainer from "../about-page/about-page";
import loginForm from "../login-page/login-page";

import "./main.css";

class MainView extends Component {
  constructor() {
    super("main", ["main"], {}, {});
  }

  public render(): void {
    document.body.append(this.getComponent());
  }

  public openAbout(): void {
    this.clearContainer();
    document.body.className = "body body_about";
    this.append(new AboutContainer());
  }

  public openMain(): void {
    document.body.className = "body body_main";
    this.clearContainer();
  }

  public openLogin(): void {
    document.body.className = "body body_login";
    this.clearContainer();
    this.append(loginForm);
  }

  public openNotFound(): void {
    document.body.className = "body body_not-found";
    this.clearContainer();
  }
}

const main = new MainView();

export default main;
