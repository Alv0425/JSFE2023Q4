import "./winner.css";
import { IWinnersInfoResponse } from "../../services/api/response-interfaces";
import Component from "../../utils/component";
import { span, svgSprite } from "../../utils/elements";
import { IRaceParticipants } from "../race-engine/race-interfaces";

class Winner extends Component {
  winnerNumber: Component<HTMLElement>;

  winnerImage: SVGSVGElement;

  winnerName: Component<HTMLElement>;

  winnerWins: Component<HTMLElement>;

  winnerTime: Component<HTMLElement>;

  constructor(
    private info: IWinnersInfoResponse,
    private number: number,
  ) {
    super("li", ["winner"]);
    this.winnerNumber = span(["winner__number"], `${number}`);
    this.winnerImage = svgSprite("./assets/car/sedan.svg#car0", "winner__image");
    this.winnerImage.style.fill = info.color;
    this.winnerName = span(["winner__name"], info.name);
    this.winnerWins = span(["winner__wins"], `${info.wins}`);
    this.winnerTime = span(["winner__time"], `${info.time.toFixed(2)}`);
    this.appendContent([this.winnerNumber, this.winnerImage, this.winnerName, this.winnerWins, this.winnerTime]);
  }

  getID() {
    return this.info.id;
  }

  increaseWinsCount() {
    this.info.wins += 1;
    this.winnerWins.setTextContent(`${this.info.wins}`);
  }

  updateWinnerResult(result: IRaceParticipants, number: number) {
    this.increaseWinsCount();
    const time = Math.round(result.raceParams.distance / result.raceParams.velocity) / 1000;
    if (this.info.time > time) {
      this.info.time = time;
      this.winnerTime.setTextContent(time.toFixed(2));
    }
    this.info.name = result.carInfo.name;
    this.info.color = result.carInfo.color;
    this.winnerName.setTextContent(`${this.info.name}`);
    this.winnerImage.style.fill = this.info.color;
    this.winnerNumber.setTextContent(`${number}`);
  }
}

export default Winner;
