import "./puzzlesbg.css";
import createSvg from "../../../utils/helpers/createsvg";
import eventEmitter from "../../../utils/eventemitter";

class PuzzlesBg {
  public constructor() {
    const puzzleright: SVGSVGElement = createSvg("./assets/background/puzzle-1.svg#puzzle-right", "puzzle-right");
    const puzzleleft: SVGSVGElement = createSvg("./assets/background/puzzle-2.svg#puzzle-left", "puzzle-left");
    document.body.append(puzzleright, puzzleleft);
    eventEmitter.on("logout", () => {
      puzzleright.remove();
      puzzleleft.remove();
    });
  }
}

export default PuzzlesBg;
