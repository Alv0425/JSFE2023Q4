import "./playboard.css";
import Component from "../../../utils/component";
import { div } from "../../../utils/elements";
import dataHandler from "../../services/datahandler";
import Game from "../../game/puzzle";
import Card from "../../game/card";

class Playboard extends Component {
  public playboardHeader: Component;

  public playboardHints: Component<HTMLElement>;

  public playboardField: Component<HTMLElement>;

  public playboardPuzzleContainer: Component<HTMLElement>;

  public playboardSourceContainer: Component<HTMLElement>;

  public cardWordplacesSource: Component[] = [];

  public cardWordplacesResult: Component[] = [];

  public currentCards: Card[] = [];

  public constructor() {
    super("div", ["playboard"]);
    this.playboardHeader = div(["playboard__header"]);
    this.playboardHints = div(["playboard__hints"]);
    this.playboardField = div(["playboard__field"]);
    this.playboardPuzzleContainer = div(["playboard__puzzle-container"]);
    this.playboardSourceContainer = div(["playboard__source-container"]);
    this.playboardField.appendContent([
      this.playboardPuzzleContainer,
      this.playboardSourceContainer,
    ]);
    this.appendContent([
      this.playboardHeader,
      this.playboardHints,
      this.playboardField,
    ]);
  }

  public clearAll() {
    this.playboardHeader.clear();
    this.playboardHints.clear();
    this.playboardPuzzleContainer.clear();
    this.playboardSourceContainer.clear();
    this.cardWordplacesSource = [];
    this.cardWordplacesResult = [];
    this.currentCards = [];
  }

  public placeCard(card: Card) {
    let i = 0;
    while (i < this.currentCards.length) {
      const cardContainer: HTMLElement =
        this.cardWordplacesResult[i].getComponent();
      if (cardContainer.children.length === 0) {
        if (!(card instanceof Component)) return;
        const parent = card.getComponent().parentElement;
        if (parent) parent.classList.remove("placed");
        cardContainer.append(card.getComponent());
        cardContainer.classList.add("placed");
        break;
      }
      i += 1;
    }
  }

  public async openRound(level: number, round: number) {
    const dataLevel = await dataHandler.fetchLevelsData(level);
    const game = new Game(dataLevel.rounds[round]);
    this.currentCards = game.generateSources(0);
    game.resizeAllCards(this.playboardPuzzleContainer.getSize());
    window.addEventListener("resize", () => {
      const size = this.playboardField.getSize();
      size.width -= 20;
      game.resizeAllCards(size);
    });
    this.cardWordplacesSource = game.generateWordsPlaces(this.currentCards);
    const resultArea = game.generateResultArea(0);
    this.cardWordplacesResult = resultArea.getChildComponents();
    this.playboardSourceContainer.appendContent(this.cardWordplacesSource);
    this.currentCards.forEach((card) => {
      card.addListener("click", () => {
        this.placeCard(card);
      });
    });
    this.playboardPuzzleContainer.append(resultArea);
  }

  public async startFirstRound() {
    this.openRound(1, 3);
  }
}

export default Playboard;
