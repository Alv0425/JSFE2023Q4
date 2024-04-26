import "./winner-modal.css";
import Component from "../../../utils/component";
import { div, h3, p, svgSprite } from "../../../utils/elements";
import type { IRaceParticipants } from "../race-interfaces";

class WinnerModal extends Component {
  private carImg: SVGSVGElement;

  constructor() {
    super("div", ["overlay", "overlay_transparent"], {}, {});
    this.addListener("click", () => this.closeWinModal());
    this.carImg = svgSprite("./assets/car/sedan.svg#car0", "winner__image");
  }

  public openWinModal(winner?: IRaceParticipants): void {
    const time = winner ? Math.round(winner.raceParams.distance / winner.raceParams.velocity) / 1000 : 0;
    const text = winner ? `${winner.carInfo.name}, finished in ${time.toFixed(2)}s` : "All cars were broken!";
    this.carImg.style.fill = winner ? winner.carInfo.color : "transparent";
    this.append(
      div(["modal-winner"], h3(["modal-winner__title"], "Winner:"), this.carImg, p(["modal-winner__text"], text)),
    );
    document.body.append(this.getComponent());
  }

  public closeWinModal(): void {
    this.destroy();
  }
}

const winnermodal = new WinnerModal();

export default winnermodal;
