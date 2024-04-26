import "./header.css";
import Component from "../../utils/component";
import { a, h1 } from "../../utils/elements";

class Header extends Component {
  private toWinners: Component<HTMLElement>;

  private toGarage: Component<HTMLElement>;

  constructor() {
    super("header", ["header"], {}, {}, h1(["header__logo"], "ASYNC RACE"));
    this.toWinners = a(["header__link"], "winners", "#/winners");
    this.toGarage = a(["header__link"], "garage", "#/garage");
    this.append(new Component("nav", ["header__nav"], {}, {}, this.toGarage, this.toWinners));
  }

  public winners(): void {
    this.toGarage.getComponent().classList.remove("header__link_active");
    this.toWinners.getComponent().classList.add("header__link_active");
  }

  public garage(): void {
    this.toGarage.getComponent().classList.add("header__link_active");
    this.toWinners.getComponent().classList.remove("header__link_active");
  }

  public render(): void {
    document.body.append(this.getComponent());
  }
}

const header = new Header();

export default header;
