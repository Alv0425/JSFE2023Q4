import "./playboard.css";
import Component from "../../../utils/component";
import { div } from "../../../utils/elements";
import dataHandler from "../../services/datahandler";
import Game from "../../game/puzzle";
import Card from "../../game/card";
import Sentence from "../../game/sentence";
import eventEmitter from "../../../utils/eventemitter";
import { getElementOfType } from "../../../utils/helpers/getelementoftype";

class Playboard extends Component {
  public playboardHeader: Component;

  public playboardHints: Component<HTMLElement>;

  public playboardField: Component<HTMLElement>;

  public playboardPuzzleContainer: Component<HTMLElement>;

  public playboardSourceContainer: Component<HTMLElement>;

  public game: Game | null = null;

  public currentSentenceContainer: HTMLElement | null = null;

  public currentSentence: Sentence | null = null;

  public cardWordplacesSource: HTMLElement[] = [];

  public cardWordplacesResult: (HTMLElement | Component | null)[] = [];

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
    eventEmitter.on("cardsresized", () => {
      this.resizeContainers();
    });
    window.addEventListener("resize", () => {
      const size = this.playboardField.getSize();
      size.width -= 20;
      if (this.game) this.game.resizeAllCards(size);
    });
  }

  public resizeContainers() {
    if (!this.currentSentence) return;
    this.currentSentence.wordCards.forEach((card) => {
      const sourceContainer = document.getElementById(
        `source-${card.sentenceIdx}-${card.wordIndex}`,
      );
      const resultContainer = document.getElementById(
        `result-${card.sentenceIdx}-${card.wordIndex}`,
      );
      if (sourceContainer)
        sourceContainer.style.setProperty("width", `${card.currentWidth}px`);
      if (resultContainer)
        resultContainer.style.setProperty("width", `${card.currentWidth}px`);
    });
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

  public swapPlaces(place1: HTMLElement, place2: HTMLElement) {
    if (place1 === place2) return;
    const elementLeftSibling = place2.previousSibling;
    const elementRightSibling = place2.previousSibling;
    place1.before(place2);
    if (elementLeftSibling) {
      elementLeftSibling.after(place1);
    } else if (elementRightSibling) {
      elementRightSibling.before(place1);
    }
    if (this.currentSentenceContainer)
      this.cardWordplacesResult = Array.from(
        this.currentSentenceContainer.children,
      ) as HTMLElement[];
    this.cardWordplacesSource = Array.from(
      this.playboardSourceContainer.getComponent().children,
    ) as HTMLElement[];
  }

  public findPlace(card: Card) {
    let i = 0;
    let cardContainer = getElementOfType(
      HTMLElement,
      this.cardWordplacesResult[0],
    );
    let target: HTMLElement | null = null;
    while (i < this.currentCards.length) {
      cardContainer = getElementOfType(
        HTMLElement,
        this.cardWordplacesResult[i],
      );
      if (card.position === "result")
        cardContainer = this.cardWordplacesSource[i];
      if (!cardContainer.classList.contains("placed")) {
        target = !target ? cardContainer : target;
        break;
      }
      i += 1;
    }
    return target;
  }

  public async placeCard(card: Card, target: HTMLElement | null) {
    const destType = card.position === "result" ? "source" : "result";
    const dest = document.getElementById(
      `${destType}-${card.sentenceIdx}-${card.wordIndex}`,
    );
    if (!target) return;
    let cardContainer = target;
    if (dest) {
      this.swapPlaces(target, dest);
      cardContainer = dest;
    }
    if (!(card instanceof Component)) return;
    const parent = card.getComponent().parentElement;
    if (!parent) return;
    parent.classList.remove("placed");
    cardContainer.classList.add("placed");
    await card.animateMove(parent, cardContainer);
    cardContainer.append(card.getComponent());
    const cardComp = card;
    cardComp.position = cardComp.position === "result" ? "source" : "result";
  }

  public async openRound(level: number, round: number) {
    const dataLevel = await dataHandler.fetchLevelsData(level);
    this.game = new Game(dataLevel.rounds[round]);
    this.loadSentence(0);
  }

  public loadSentence(idx: number) {
    if (!this.game) return;
    this.currentCards = this.game.generateSources(idx);
    this.cardWordplacesSource = this.game.generateWordsPlaces(
      this.currentCards,
    );
    this.game.resizeAllCards(this.playboardPuzzleContainer.getSize());
    const resultArea = this.game.generateResultArea(idx);
    this.currentSentence = this.game.wordSentences[idx];
    this.currentSentenceContainer = resultArea.getComponent();
    this.cardWordplacesResult = resultArea.getContent();
    this.playboardSourceContainer.appendContent(this.cardWordplacesSource);
    this.playboardPuzzleContainer.append(resultArea);
    this.currentCards.forEach((card) => {
      card.addListener("click", () => {
        this.placeCard(card, this.findPlace(card));
        if (this.game)
          this.game.resizeAllCards(this.playboardPuzzleContainer.getSize());
      });
    });
  }

  public async startFirstRound() {
    this.openRound(1, 3);
  }
}

export default Playboard;
