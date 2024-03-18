import Component from "../../../utils/component";
import { button, h2, p, span } from "../../../utils/elements";
import eventEmitter from "../../../utils/eventemitter";
import storage from "../../services/localstorage";
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
      h2(["start-screen__greeting"], `Hello, ${storage.getName()}!`),
      p(["start-screen__text"], "RSS-PUZZLE is a game designed to enhance English language skills."),
      p(
        ["start-screen__text"],
        "You will be challenged to assemble sentences from jigsaw puzzle word cards. Once you have properly organized all the words, the artwork will be revealed.",
      ),
      p(["start-screen__text"], "Good luck and have fun!"),
    );
    const startButton = button(["start-screen__button"], "", "button", "start-button");
    startButton.appendContent([span(["start-screen__button-label"], "START"), span(["start-screen__button-icon"])]);
    this.append(startButton);
    this.puzzlesBg = new PuzzlesBg();
    startButton.addListener("click", () => eventEmitter.emit("startclicked"));
  }
}

export default StartScreen;
