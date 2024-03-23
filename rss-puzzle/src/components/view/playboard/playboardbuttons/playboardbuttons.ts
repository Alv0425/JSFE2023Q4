import Component from "../../../../utils/component";
import { div, span } from "../../../../utils/elements";
import AutocompleteButton from "./autocomplete/autocomplete";
import GameButton from "./gamebutton/gamebutton";
import StatisticsButton from "./statisticsbutton/statisticsbutton";

class PlayboardButtons extends Component {
  public roundLabel: Component<HTMLElement>;

  public constructor() {
    super("div", ["playboard__buttons"]);
    this.drawContinueButton();
    this.drawStatisticsButton();
    this.drawAutocompleteButton();
    this.roundLabel = div(["playboard__round-label"]);
    this.append(this.roundLabel);
  }

  public drawStatisticsButton() {
    const statisticsButton = new StatisticsButton();
    this.append(statisticsButton);
  }

  public drawAutocompleteButton() {
    const autocompleteButton = new AutocompleteButton();
    this.append(autocompleteButton);
  }

  public drawContinueButton() {
    const nextButton = new GameButton();
    this.append(nextButton);
  }

  public updateRoundLabel(level: number, round: number) {
    if (!this.roundLabel) return;
    this.roundLabel.clear();
    this.roundLabel.appendContent([
      span(["playboard__round-label-level"], `LEVEL: ${level}`),
      span(["playboard__round-label-level"], `ROUND: ${round + 1}`),
    ]);
  }
}

const playboardButtons = new PlayboardButtons();

export default playboardButtons;
