import Component from "../../../utils/component";
import { h2, p } from "../../../utils/elements";
import PuzzlesBg from "../background/puzzlesbg";
import "./startscreen.css";

class StartScreen extends Component {
  private puzzlesBg: PuzzlesBg;

  public constructor() {
    super(
      "div",
      ["start-screen"],
      {},
      {},
      h2(["start-screen__title"], "Welcome to RSS PUZZLE game!"),
      p(
        ["start-screen__text"],
        "RSS-PUZZLE is a game designed to enhance English language skills.",
      ),
      p(
        ["start-screen__text"],
        "You will be challenged to assemble sentences from jumbled puzzle-like word cards. Once you have properly organized all the words, you will reveal beautiful artwork.",
      ),
      p(["start-screen__text"], "Good luck and have fun!"),
    );
    this.puzzlesBg = new PuzzlesBg();
  }
}

export default StartScreen;
