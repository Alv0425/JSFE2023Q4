import "./playboard.css";
import Component from "../../../utils/component";
import { div, span } from "../../../utils/elements";
import dataHandler from "../../services/datahandler";
import Game from "../../game/puzzle";
import Card from "../../game/card";
import Sentence from "../../game/sentence";
import eventEmitter from "../../../utils/eventemitter";
import { getElementOfType } from "../../../utils/helpers/getelementoftype";
import GameButton from "./gamebutton/gamebutton";
import AutocompleteButton from "./autocomplete/autocomplete";
import TranslationHint from "./tratslationhint/translationhint";
import AudioHint from "./audiohint/audiohint";
import ImageHint from "./imagehint/imagehint";
import SelectLevel from "./selectlevel/selectlevel";
import storage from "../../services/localstorage";
import loader from "../loaderscreen/loader";
import imageInfo from "./imageinfo/imageinfo";
import StatisticsButton from "./statisticsbutton/statisticsbutton";
import { IRoundResult } from "../../../utils/types/interfaces";

class Playboard extends Component {
  public playboardHeader: Component;

  private hints: {
    imagehint?: ImageHint;
    audioHint?: AudioHint;
    translationHint?: TranslationHint;
  } = {};

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

  private selectLevel: SelectLevel;

  public roundLabel: Component<HTMLElement> | null = null;

  public aspectRatio: number = 6 / 9;

  public constructor() {
    super("div", ["playboard"]);
    this.playboardHeader = div(["playboard__header"]);
    this.selectLevel = new SelectLevel();
    this.playboardHeader.append(this.selectLevel.button);
    this.playboardHints = div(["playboard__hints"]);
    this.playboardField = div(["playboard__field"]);
    this.playboardButtons = div(["playboard__buttons"]);
    this.playboardPuzzleContainer = div(["playboard__puzzle-container"]);
    this.playboardSourceContainer = div(["playboard__source-container"]);
    this.playboardField.appendContent([this.playboardPuzzleContainer, this.playboardSourceContainer, imageInfo]);
    this.appendContent([this.playboardHeader, this.playboardHints, this.playboardField, this.playboardButtons]);
    this.setListeners();
    this.drawHints();
    this.drawContinueButton();
    this.drawStatisticsButton();
    this.drawAutocompleteButton();
    this.drawRoundLabel();
  }

  private resize() {
    const size = this.playboardField.getSize();
    size.width -= 20;
    size.height = Math.floor(size.width * this.aspectRatio);
    this.playboardPuzzleContainer.setStyleAttribute("aspect-ratio", `1000 / ${Math.floor(this.aspectRatio * 1000)}`);
    if (this.game) this.game.resizeAllCards(size);
    this.resizeContainers();
  }

  private setListeners() {
    eventEmitter.on("cardsresized", () => this.resizeContainers());
    window.addEventListener("resize", () => this.resize());
    eventEmitter.on("sentencesolved", () => this.setSolved());
    eventEmitter.on("sentencearranged", () => this.setArranged());
    eventEmitter.on("statistics-page-closed", () => setTimeout(() => this.resize(), 100));
    eventEmitter.on("round-completed", () => this.completedRoundHandler());
    eventEmitter.on("continue-game", () => this.nextSentence());
    eventEmitter.on("check-sentence", () => {
      this.currentSentenceContainer?.classList.toggle("check-mode");
      this.checkSentence();
    });
    eventEmitter.on("open-select-modal", () => this.selectLevel.openMmodalSelectGame(this.openRound.bind(this)));
    eventEmitter.on("show-image-hint", () => {
      this.playboardField.getComponent().classList.add("playboard__field-show-image");
    });
    eventEmitter.on("hide-image-hint", () => {
      this.playboardField.getComponent().classList.remove("playboard__field-show-image");
    });
    eventEmitter.on("source-block-filled", () => this.currentSentenceContainer?.classList.remove("check-mode"));
    eventEmitter.on("autocomplete", async () => {
      await this.arrangeCards();
      eventEmitter.emit("sentencearranged");
    });
    eventEmitter.on("sentencesolved-invalid-order", async () => {
      await this.arrangeCards();
      eventEmitter.emit("sentencesolved");
    });
  }

  public async arrangeCards() {
    if (!this.currentSentenceContainer) return;
    await this.currentSentence?.animateArrangingCards(this.currentSentenceContainer);
    this.currentCards.forEach((card) => card.removeAllListeners());
    setTimeout(() => {
      this.arrangeSentence();
      this.currentSentenceContainer?.classList.remove("check-mode");
    }, 500);
  }

  public completedRoundHandler() {
    eventEmitter.emit("reveal-image");
    if (this.game) {
      this.playboardPuzzleContainer.setStyleAttribute(
        "background-image",
        `url(${dataHandler.getImageUrl(this.game?.info.levelData.imageSrc)})`,
      );
      storage.setLastCompletedRound(this.game.levelIndex, this.game.roundIndex);
      const currentGameResult: IRoundResult = {
        knownWords: this.game.state.solvedSentences,
        unknownWords: this.game.state.openedSentences,
      };
      storage.setRoundStats(currentGameResult, this.game.info.levelData.id);
      storage.setCurrentRoundStats(currentGameResult, this.game.info);
      imageInfo.setInfo(this.game.info.levelData);
      imageInfo.open();
    }
  }

  private drawHints() {
    const hintTogglersContainer = div(["playboard__hints-torrlers"]);
    this.playboardHeader.append(hintTogglersContainer);
    this.hints.translationHint = new TranslationHint();
    this.hints.audioHint = new AudioHint();
    this.hints.imagehint = new ImageHint();
    this.playboardHints.appendContent([
      this.hints.translationHint.getHintContainer(),
      this.hints.audioHint.getHintButton(),
    ]);
    hintTogglersContainer.appendContent([
      this.hints.translationHint.getHintToggler(),
      this.hints.audioHint.getHintToggler(),
      this.hints.imagehint.getHintToggler(),
    ]);
  }

  private arrangeSentence() {
    this.cardWordplacesResult.sort((place1, place2) => {
      let id1: string | undefined;
      let id2: string | undefined;
      if (place1 instanceof HTMLElement) id1 = place1.getAttribute("id")?.split("-")[2];
      if (place2 instanceof HTMLElement) id2 = place2.getAttribute("id")?.split("-")[2];
      if (!id1 || !id2) return 0;
      return parseInt(id1, 10) - parseInt(id2, 10);
    });
    this.cardWordplacesResult.forEach((place, i) => {
      if (this.currentSentence?.wordCards[i])
        if (place) place.append(this.currentSentence?.wordCards[i].getComponent());
      if (place instanceof HTMLElement) {
        place.remove();
        place.classList.add("placed", "correct");
        place.classList.add("error");
        this.currentSentenceContainer?.append(place);
      }
    });
  }

  private setSolved() {
    this.currentCards.forEach((card) => card.removeAllListeners());
    this.currentSentenceContainer?.classList.add("puzzle__sentence_correct");
    if (this.currentSentence && !this.game?.state.solvedSentences.includes(this.currentSentence?.sentenceIdx))
      this.game?.state.solvedSentences.push(this.currentSentence?.sentenceIdx);
    if (this.currentSentence?.sentenceIdx === 9) eventEmitter.emit("round-completed");
  }

  private setArranged() {
    this.currentCards.forEach((card) => card.removeAllListeners());
    this.currentSentenceContainer?.classList.add("puzzle__sentence_arranged");
    if (this.currentSentence) this.game?.state.openedSentences.push(this.currentSentence?.sentenceIdx);
    if (this.currentSentence?.sentenceIdx === 9) eventEmitter.emit("round-completed");
  }

  private async nextSentence() {
    await this.clearSentenceBlocks();
    this.playboardSourceContainer.clear();
    if (this.game) {
      if (this.game.state.currentSentence.current < 9) {
        this.game.state.currentSentence.current += 1;
        this.loadSentence(this.game.state.currentSentence.current);
      } else {
        this.openNextRound();
        eventEmitter.emit("open-next-round");
      }
    }
  }

  public drawStatisticsButton() {
    const statisticsButton = new StatisticsButton();
    this.playboardButtons.append(statisticsButton);
  }

  public drawAutocompleteButton() {
    const autocompleteButton = new AutocompleteButton();
    this.playboardButtons.append(autocompleteButton);
  }

  public drawContinueButton() {
    const nextButton = new GameButton();
    this.playboardButtons.append(nextButton);
    eventEmitter.on("sentencesolved", () => {
      nextButton.getComponent().disabled = false;
    });
  }

  public drawRoundLabel() {
    this.roundLabel = div(["playboard__round-label"]);
    this.playboardButtons.append(this.roundLabel);
  }

  public updateRoundLabel(level: number, round: number) {
    if (!this.roundLabel) return;
    this.roundLabel.clear();
    this.roundLabel.appendContent([
      span(["playboard__round-label-level"], `LEVEL: ${level}`),
      span(["playboard__round-label-level"], `ROUND: ${round + 1}`),
    ]);
  }

  private checkSentence() {
    const correctWords = this.currentSentence?.words;
    if (!correctWords) return;
    const actualWords = this.game?.state.currentSentence.resultBlock.map((order) => {
      if (order === -1) return "";
      return correctWords[order];
    });
    const isCorrectOrder = this.game?.state.currentSentence.resultBlock.every((order, idx) => idx === order);
    if (!actualWords) return;
    if (correctWords.join(" ") === actualWords.join(" ")) {
      if (isCorrectOrder) eventEmitter.emit("sentencesolved");
      if (!isCorrectOrder) eventEmitter.emit("sentencesolved-invalid-order");
      this.currentSentenceContainer?.classList.remove("check-mode");
    }
    correctWords.forEach((word, i) => {
      getElementOfType(HTMLElement, this.cardWordplacesResult[i]).classList.remove("error");
      getElementOfType(HTMLElement, this.cardWordplacesResult[i]).classList.remove("correct");
      const correctness = actualWords[i] === word ? "correct" : "error";
      getElementOfType(HTMLElement, this.cardWordplacesResult[i]).classList.add(correctness);
    });
  }

  private async loadNextRound(level: number, round: number) {
    const dataLevel = await dataHandler.fetchLevelsData(level);
    if (dataLevel.roundsCount - 1 === round) {
      if (level === 6) {
        await this.openRound(1, 0);
        return;
      }
      await this.openRound(level + 1, 0);
      return;
    }
    await this.openRound(level, round + 1);
  }

  private async openNextRound() {
    if (!this.game) return;
    const level = this.game.levelIndex;
    const round = this.game.roundIndex;
    await this.loadNextRound(level, round);
  }

  public resizeContainers() {
    if (!this.currentSentence) return;
    this.currentSentence.wordCards.forEach((card) => {
      const sourceContainer = document.getElementById(`source-${card.sentenceIdx}-${card.wordIndex}`);
      const resultContainer = document.getElementById(`result-${card.sentenceIdx}-${card.wordIndex}`);
      if (sourceContainer) sourceContainer.style.setProperty("width", `${card.currentWidth}px`);
      if (resultContainer) resultContainer.style.setProperty("width", `${card.currentWidth}px`);
      sourceContainer?.classList.remove("highlight");
      resultContainer?.classList.remove("highlight");
    });
  }

  private async clearSentenceBlocks() {
    this.playboardSourceContainer.getComponent().classList.add("hide");
    return new Promise((res) => {
      setTimeout(() => {
        this.playboardSourceContainer.clear();
        this.cardWordplacesSource = [];
        this.cardWordplacesResult = [];
        this.currentCards = [];
        this.playboardSourceContainer.getComponent().classList.remove("hide");
        res(true);
      }, 200);
    });
  }

  public async clearAll() {
    this.playboardPuzzleContainer.getComponent().classList.add("hide");
    await this.clearSentenceBlocks();
    return new Promise((res) => {
      setTimeout(() => {
        this.playboardPuzzleContainer.clear();
        res(true);
        this.playboardPuzzleContainer.getComponent().classList.remove("hide");
        this.playboardPuzzleContainer.removeStyleAttribute("background-image");
      }, 300);
    });
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
    this.updateCardsContainers();
  }

  private updateCardsContainers() {
    if (this.currentSentenceContainer) {
      if (!this.currentSentenceContainer.children.length) return;
      this.cardWordplacesResult = Array.from(this.currentSentenceContainer.children) as HTMLElement[];
    }
    if (!this.playboardSourceContainer.getComponent().children.length) return;
    this.cardWordplacesSource = Array.from(this.playboardSourceContainer.getComponent().children) as HTMLElement[];
  }

  public findPlace(card: Card) {
    let i = 0;
    let cardContainer = getElementOfType(HTMLElement, this.cardWordplacesResult[0]);
    let target: HTMLElement | null = null;
    while (i < this.currentCards.length) {
      cardContainer = getElementOfType(HTMLElement, this.cardWordplacesResult[i]);
      if (card.position === "result") cardContainer = this.cardWordplacesSource[i];
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
    this.game.state.currentSentence.resultBlock = this.getStat(this.cardWordplacesResult as HTMLElement[]);
    this.game.state.currentSentence.resultBlock = this.getStat(this.cardWordplacesResult as HTMLElement[]);
    this.game.state.currentSentence.sourceBlock = this.getStat(this.cardWordplacesSource);
    if (this.game.state.currentSentence.sourceBlock.every((i) => i < 0)) {
      eventEmitter.emit("source-block-epmty");
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

  public insertCard(card: Card, dest: HTMLElement, target: HTMLElement, destType: string) {
    if (dest) {
      const parent = card.getComponent().parentElement;
      if (!parent) return;
      parent.classList.remove("placed");
      dest.append(card.getComponent());
      if (card.isLeftSideTarget(target)) {
        target.before(dest);
      } else {
        target.after(dest);
      }
      dest.classList.add("placed");
      const cardComp = card;
      card.unsetCoordinates();
      cardComp.draggable = false;
      target?.classList.remove("highlight");
      if (destType === "result" || destType === "source") cardComp.position = destType;
    }
  }

  public async placeCardOndrop(card: Card, target: HTMLElement | null) {
    let destType = "result";
    const targetID = target?.getAttribute("id");
    if (targetID) destType = targetID.split("-")[0];
    const dest = document.getElementById(`${destType}-${card.sentenceIdx}-${card.wordIndex}`);
    if (!target) return;
    if (target?.classList.contains("placed")) {
      if (!dest) return;
      this.insertCard(card, dest, target, destType);
      return;
    }
    if (dest) await this.changePosition(card, target, dest, false);
    card.unsetCoordinates();
    card.unsetDraggable();
    if (destType === "result" || destType === "source") card.setPosition(destType);
  }

  public async changePosition(card: Card, target: HTMLElement, dest: HTMLElement, isAnimate: boolean) {
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
    target?.classList.remove("highlight");
    if (isAnimate) await card.animateMove(parent, cardContainer);
    cardContainer.append(card.getComponent());
  }

  public async placeCard(card: Card, target: HTMLElement | null) {
    card.unsetCoordinates();
    const destType = card.position === "result" ? "source" : "result";
    const dest = document.getElementById(`${destType}-${card.sentenceIdx}-${card.wordIndex}`);
    if (!target) return;
    if (dest) this.changePosition(card, target, dest, true);
    card.unsetDraggable();
    card.setPosition(card.position === "result" ? "source" : "result");
  }

  public async openRound(level: number, round: number) {
    eventEmitter.emit("open-round");
    await this.clearAll();
    const dataLevel = await dataHandler.fetchLevelsData(level);
    this.game = new Game(dataLevel.rounds[round]);
    this.loadSentence(0);
    loader.draw();
    const image = new Image();
    image.src = dataHandler.getImageUrl(this.game.info.levelData.imageSrc);
    image.onload = () => {
      loader.close();
      this.aspectRatio = image.height / image.width;
      this.resize();
    };
    setTimeout(() => loader.close(), 3000);
    storage.setCurrentRound(level, round);
    this.updateRoundLabel(level, round);
    imageInfo.close();
  }

  public loadSentence(idx: number) {
    if (!this.game) return;
    eventEmitter.emit("startsentence");
    this.currentCards = this.game.generateSources(idx);
    this.cardWordplacesSource = this.game.generateWordsPlaces(this.currentCards);
    this.resize();
    const resultArea = this.game.generateResultArea(idx);
    this.currentSentence = this.game.wordSentences[idx];
    this.hints.translationHint?.setHint(this.game.info.words[idx].textExampleTranslate);
    this.hints.audioHint?.setAudio(this.game.info.words[idx].audioExample);
    this.currentSentenceContainer = resultArea.getComponent();
    this.cardWordplacesResult = resultArea.getContent();
    this.playboardSourceContainer.appendContent(this.cardWordplacesSource);
    this.playboardPuzzleContainer.append(resultArea);
    this.resizeContainers();
    this.addListenersToCards();
    this.currentCards.forEach((card) => {
      if (this.game) card.setBackground(this.game.info.levelData.imageSrc);
    });
  }

  private addListenersToCards() {
    this.currentCards.forEach((card) => {
      const draghandler = () => {
        if (card.draggable && card.curTarget instanceof HTMLElement) this.placeCardOndrop(card, card.curTarget);
        this.updateCardsContainers();
        this.updateCurrentGameStats();
        this.resize();
      };
      card.addListener("mousedown", (e) => {
        card.dragCardMouse(e as MouseEvent, draghandler);
      });
      card.addListener("touchstart", (e) => {
        card.dragCardTouch(e as TouchEvent, draghandler);
      });
      card.addListener("click", () => {
        if (card.draggable) {
          card.unsetDraggable();
          return;
        }
        this.placeCard(card, this.findPlace(card));
        this.updateCurrentGameStats();
        this.resize();
      });
    });
  }

  public async startFirstRound() {
    const lastRound = storage.getLastCompletedRound();
    if (lastRound) await this.loadNextRound(lastRound.level, lastRound.round);
  }
}

const playboard = new Playboard();

export default playboard;
