import "./main.css";
import Component from "../../utils/component";
import garage from "../garage/garage";
import winners from "../winners/winners";
import header from "../header/header";

class MainView extends Component {
  constructor() {
    super("main", ["main"], {}, {});
  }

  public render(): void {
    document.body.append(this.getComponent());
  }

  public drawGarage(): void {
    winners.getComponent().remove();
    header.garage();
    this.append(garage);
  }

  public drawWinners(): void {
    garage.getComponent().remove();
    header.winners();
    this.append(winners);
  }
}

const main = new MainView();

export default main;