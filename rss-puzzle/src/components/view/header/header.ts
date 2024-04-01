import "./header.css";
import Component from "../../../utils/component";
import { button, div, h1 } from "../../../utils/elements";
import modal from "../modal/modal";
import eventEmitter from "../../../utils/eventemitter";
import storage from "../../services/localstorage";

class Header extends Component {
  private loginButton: Component;

  private headerCont: Component;

  public constructor() {
    super("header", ["header"]);
    this.headerCont = div(["header__container"], h1(["header__logo"], "RSS PUZZLE"));
    this.loginButton = button(["header__button"], "LOG OUT");
    this.loginButton.addListener("click", () => {
      modal.openMmodalLogout();
    });
    this.headerCont.append(this.loginButton);
    eventEmitter.on("login", () => {
      this.draw();
      this.append(this.headerCont);
    });
    eventEmitter.on("logout", () => {
      this.clear();
    });
    document.body.append(this.node);
    this.draw();
  }

  public draw(): void {
    this.clear();
    if (storage.getData().firstName) {
      this.append(this.headerCont);
    }
    this.append(this.headerCont);
  }
}

export default Header;
