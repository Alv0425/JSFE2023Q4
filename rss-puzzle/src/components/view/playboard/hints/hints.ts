import Component from "../../../../utils/component";
import { div } from "../../../../utils/elements";
import playboardNav from "../playboardnav/playboardnav";
import AudioHint from "./audiohint/audiohint";
import ImageHint from "./imagehint/imagehint";
import TranslationHint from "./tratslationhint/translationhint";

class Hints extends Component {
  public hints: {
    imagehint?: ImageHint;
    audioHint?: AudioHint;
    translationHint?: TranslationHint;
  } = {};

  public constructor() {
    super("div", ["playboard__hints"]);
    this.drawHints();
  }

  private drawHints() {
    const hintTogglersContainer = div(["playboard__hints-torrlers"]);
    playboardNav.append(hintTogglersContainer);
    this.hints.translationHint = new TranslationHint();
    this.hints.audioHint = new AudioHint();
    this.hints.imagehint = new ImageHint();
    this.appendContent([this.hints.translationHint.getHintContainer(), this.hints.audioHint.getHintButton()]);
    hintTogglersContainer.appendContent([
      this.hints.translationHint.getHintToggler(),
      this.hints.audioHint.getHintToggler(),
      this.hints.imagehint.getHintToggler(),
    ]);
  }
}

const hintsContainer = new Hints();

export default hintsContainer;
