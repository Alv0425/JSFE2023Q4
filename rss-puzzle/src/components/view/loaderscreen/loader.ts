import "./loader.css";
import Component from "../../../utils/component";
import { div } from "../../../utils/elements";

class Loader extends Component {
  public constructor() {
    super("div", ["overlay", "overlay_loader"]);
  }

  public draw(): void {
    this.append(div(["loader"]));
    document.body.append(this.getComponent());
  }

  public close(): void {
    this.getComponent().classList.add("fade-out");
    setTimeout(() => {
      this.getComponent().classList.remove("fade-out");
      this.destroy();
    }, 500);
  }
}

const loader = new Loader();

export default loader;
