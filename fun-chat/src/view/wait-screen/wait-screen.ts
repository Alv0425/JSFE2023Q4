import { div, p } from "../../utils/component/elements";
import Component from "../../utils/component/component";
import "./wait-screen.css";

class WaitScreen extends Component {
  constructor() {
    super("div", ["overlay"]);
  }

  public openWaitOverlay(): void {
    this.clear();
    this.append(
      div(
        ["wait-screen"],
        div(["wait-screen__spinner"]),
        p(["wait-screet__text"], "Please, wait"),
        p(["wait-screet__text"], "Trying to reconnect."),
      ),
    );
    document.body.append(this.getComponent());
  }

  public close(): void {
    this.clear();
    this.getComponent().remove();
  }
}

const waitScreen = new WaitScreen();

export default waitScreen;
