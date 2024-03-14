import "./playboard.css";
import Component from "../../../utils/component";
import { div } from "../../../utils/elements";
import dataHandler from "../../services/datahandler";
import Game from "../../game/puzzle";
import Card from "../../game/card";
import Sentence from "../../game/sentence";
import eventEmitter from "../../../utils/eventemitter";
import { getElementOfType } from "../../../utils/helpers/getelementoftype";
import GameButton from "./gamebutton/gamebutton";

class Playboard extends Component {
  public playboardHeader: Component;

  public playboardHints: Component<HTMLElement>;

  public playboardField: Component<HTMLElement>;

  public playboardButtons: Component;

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
    this.playboardButtons = div(["playboard__buttons"]);
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
      this.playboardButtons,
    ]);
    eventEmitter.on("cardsresized", () => {
      this.resizeContainers();
    });
    window.addEventListener("resize", () => {
      const size = this.playboardField.getSize();
      size.width -= 20;
      if (this.game) this.game.resizeAllCards(size);
    });
    eventEmitter.on("sentencesolved", () => {
      this.setSolved();
    });
    eventEmitter.on("continue-game", () => {
      this.nextSentence();
    });
    eventEmitter.on("check-sentence", () => {
      this.currentSentenceContainer?.classList.toggle("check-mode");
      this.checkSentence();
    });
    eventEmitter.on("source-block-filled", () =>
      this.currentSentenceContainer?.classList.remove("check-mode"),
    );
  }

  private setSolved() {
    this.currentCards.forEach((card) => card.removeAllListeners());
    this.currentSentenceContainer?.classList.add("puzzle__sentence_correct");
  }

  private nextSentence() {
    this.clearSentenceBlocks();
    this.playboardSourceContainer.clear();
    if (this.game) {
      if (this.game.state.currentSentence.current < 9) {
        this.game.state.currentSentence.current += 1;
        console.log(this.game.state.currentSentence.current);
        this.loadSentence(this.game.state.currentSentence.current);
        this.drawContinueButton();
      } else {
        this.openNextRound();
      }
    }
  }

  public drawContinueButton() {
    const nextButton = new GameButton();
    this.playboardButtons.append(nextButton);
    eventEmitter.on("sentencesolved", () => {
      nextButton.getComponent().disabled = false;
    });
  }

  private checkSentence() {
    const correctWords = this.currentSentence?.words;
    if (!correctWords) return;
    const actualWords = this.game?.state.currentSentence.resultBlock.map(
      (order) => {
        if (order === -1) return "";
        return correctWords[order];
      },
    );
    if (!actualWords) return;
    if (correctWords.join(" ") === actualWords.join(" "))
      eventEmitter.emit("sentencesolved");
    correctWords.forEach((word, i) => {
      console.log(actualWords[i] === word, actualWords[i], word);
      getElementOfType(
        HTMLElement,
        this.cardWordplacesResult[i],
      ).classList.remove("error");
      getElementOfType(
        HTMLElement,
        this.cardWordplacesResult[i],
      ).classList.remove("correct");
      const correctness = actualWords[i] === word ? "correct" : "error";
      getElementOfType(HTMLElement, this.cardWordplacesResult[i]).classList.add(
        correctness,
      );
    });
  }

  private async openNextRound() {
    if (!this.game) return;
    const level = this.game.levelIndex;
    const round = this.game.roundIndex;
    const dataLevel = await dataHandler.fetchLevelsData(level);
    if (dataLevel.roundsCount === round) {
      console.log("open next level");
      return;
    }
    this.clearAll();
    console.log(level, round + 1, "openning");
    await this.openRound(level, round + 1);
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

  private clearSentenceBlocks() {
    this.playboardSourceContainer.clear();
    this.playboardButtons.clear();
    this.cardWordplacesSource = [];
    this.cardWordplacesResult = [];
    this.currentCards = [];
  }

  public clearAll() {
    this.playboardHeader.clear();
    this.playboardHints.clear();
    this.playboardPuzzleContainer.clear();
    this.clearSentenceBlocks();
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
    if (this.currentSentenceContainer) {
      if (!this.currentSentenceContainer.children.length) return;
      this.cardWordplacesResult = Array.from(
        this.currentSentenceContainer.children,
      ) as HTMLElement[];
    }
    if (!this.playboardSourceContainer.getComponent().children.length) return;
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

  public updateCurrentGameStats() {
    if (!this.game) return;
    if (!this.currentSentence) return;
    this.game.state.isCurrent = true;
    this.game.state.currentSentence.current = this.currentSentence.sentenceIdx;
    this.game.state.currentSentence.resultBlock = this.getStat(
      this.cardWordplacesResult as HTMLElement[],
    );
    this.game.state.currentSentence.resultBlock = this.getStat(
      this.cardWordplacesResult as HTMLElement[],
    );
    this.game.state.currentSentence.sourceBlock = this.getStat(
      this.cardWordplacesSource,
    );
    if (this.game.state.currentSentence.sourceBlock.every((i) => i < 0)) {
      eventEmitter.emit("source-block-epmty");
      console.log("source-block-epmty");
    } else {
      eventEmitter.emit("source-block-filled");
    }
    this.checkSentence();
  }

  private getStat(cards: HTMLElement[]) {
    const stat = [];
    for (let i = 0; i < cards.length; i += 1) {
      const cardRes = getElementOfType(HTMLElement, cards[i]);
      if (!cardRes.classList.contains("placed")) {
        stat.push(-1);
      } else {
        const wordidx = cardRes.getAttribute("id")?.split("-")[2];
        if (wordidx) stat.push(parseInt(wordidx, 10));
      }
    }
    return stat;
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
    console.log(this.game);
    this.loadSentence(0);
    this.drawContinueButton();
  }

  public loadSentence(idx: number) {
    if (!this.game) return;
    this.currentCards = this.game.generateSources(idx);
    this.cardWordplacesSource = this.game.generateWordsPlaces(
      this.currentCards,
    );
    const fieldsize = this.playboardPuzzleContainer.getSize();
    this.game.resizeAllCards(fieldsize);
    const resultArea = this.game.generateResultArea(idx);
    this.currentSentence = this.game.wordSentences[idx];
    this.currentSentenceContainer = resultArea.getComponent();
    this.cardWordplacesResult = resultArea.getContent();
    this.playboardSourceContainer.appendContent(this.cardWordplacesSource);
    this.playboardPuzzleContainer.append(resultArea);
    this.currentCards.forEach((card) => {
      card.addListener("click", () => {
        this.placeCard(card, this.findPlace(card));
        this.updateCurrentGameStats();
        if (this.game)
          this.game.resizeAllCards(this.playboardPuzzleContainer.getSize());
      });
    });
  }

  public async startFirstRound() {
    this.openRound(1, 0);
  }
}

export default Playboard;
