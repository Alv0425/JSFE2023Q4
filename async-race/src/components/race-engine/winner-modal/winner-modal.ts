import "./winner-modal.css";
import Component from "../../../utils/component";
import { div, h3, p, svgSprite } from "../../../utils/elements";
import { IRaceParticipants } from "../race-interfaces";

class WinnerModal extends Component {
  constructor() {
    super("div", ["overlay", "overlay_transparent"], {}, {});
    this.addListener("click", () => this.closeWinModal());
  }

  public openWinModal(winner?: IRaceParticipants) {
    const time = winner ? Math.round(winner.raceParams.distance / winner.raceParams.velocity) / 1000 : 0;
    const text = winner ? `${winner.carInfo.name}, finished in ${time.toFixed(2)}s` : "All cars were broken!";
    const carImg = svgSprite("./assets/car/sedan.svg#car0", "winner__image");
    carImg.style.fill = winner ? winner.carInfo.color : "transparent";
    document.body.append(this.getComponent());
    this.append(div(["modal-winner"], h3(["modal-winner__title"], "Winner:"), carImg, p(["modal-winner__text"], text)));
  }

  public closeWinModal() {
    this.destroy();
  }
}

const winnermodal = new WinnerModal();

export default winnermodal;
