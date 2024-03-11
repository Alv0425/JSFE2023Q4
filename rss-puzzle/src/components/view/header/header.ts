import "./header.css";
import Component from "../../../utils/component";
import { button, div, h1 } from "../../../utils/elements";
import modal from "../modal/modal";

class Header extends Component {
  private loginButton: Component;

  public constructor() {
    super(
      "header",
      ["header"],
      {},
      {},
      div(["header__container"], h1(["header__logo"], "RSS PUZZLE")),
    );
    const headerCont = this.getContent()[0] as Component;
    this.loginButton = button(["header__button"], "LOG OUT");
    this.loginButton.addListener("click", () => {
      modal.openMmodalLogout();
    });
    headerCont.append(this.loginButton.getComponent());
    this.draw();
  }

  public draw() {
    document.body.append(this.node);
  }
}

export default Header;
