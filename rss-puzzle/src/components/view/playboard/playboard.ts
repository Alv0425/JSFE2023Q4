import "./playboard.css";
import Component from "../../../utils/component";
import { div } from "../../../utils/elements";
import dataHandler from "../../services/datahandler";
import Game from "../../game/puzzle";
import Card from "../../game/card";
import Sentence from "../../game/sentence";
import eventEmitter from "../../../utils/eventemitter";
import storage from "../../services/localstorage";
import loader from "../loaderscreen/loader";
import imageInfo from "./imageinfo/imageinfo";
import { ComponentType, IRoundResult } from "../../../utils/types/interfaces";
import movesHandler from "../../services/cardsmoveshandler";
import selectLevel from "./selectlevel/selectlevel";
import playboardNav from "./playboardnav/playboardnav";
import hintsContainer from "./hints/hints";
import playboardButtons from "./playboardbuttons/playboardbuttons";

class Playboard extends Component {
  public playboardField: Component<HTMLElement>;

  public playboardPuzzleContainer: Component<HTMLElement>;

  public playboardSourceContainer: Component<HTMLElement>;

  public game: Game | null = null;

  public currentSentenceContainer: HTMLElement | null = null;

  public currentSentence: Sentence | null = null;

  public cardWordplacesSource: HTMLElement[] = [];

  public cardWordplacesResult: ComponentType[] = [];

  public currentCards: Card[] = [];

  public roundLabel: Component<HTMLElement> | null = null;

  public aspectRatio: number = 6 / 9;

  public constructor() {
    super("div", ["playboard"]);
    this.playboardField = div(["playboard__field"]);
    this.playboardPuzzleContainer = div(["playboard__puzzle-container"]);
    this.playboardSourceContainer = div(["playboard__source-container"]);
    this.playboardField.appendContent([this.playboardPuzzleContainer, this.playboardSourceContainer, imageInfo]);
    this.appendContent([playboardNav, hintsContainer, this.playboardField, playboardButtons]);
    this.setListeners();
  }

  private resize() {
    const size = this.playboardField.getSize();
    size.width -= 20;
    size.height = Math.floor(size.width * this.aspectRatio);
    this.playboardPuzzleContainer.setStyleAttribute("aspect-ratio", `1000 / ${Math.floor(this.aspectRatio * 1000)}`);
    if (this.game) this.game.resizeAllCards(size);
    if (this.currentSentence) this.currentSentence.resizeContainers();
  }

  private setListeners() {
    eventEmitter.on("cardsresized", () => {
      if (this.currentSentence) this.currentSentence.resizeContainers();
    });
    window.addEventListener("resize", () => this.resize());
    eventEmitter.on("sentencesolved", () => this.game?.setSolved());
    eventEmitter.on("sentencearranged", () => this.game?.setArranged());
    eventEmitter.on("round-completed", () => this.completedRoundHandler());
    eventEmitter.on("continue-game", () => this.nextSentence());
    eventEmitter.on("check-sentence", () => {
      this.currentSentenceContainer?.classList.toggle("check-mode");
      this.checkSentence();
    });
    eventEmitter.on("open-select-modal", () => selectLevel.openMmodalSelectGame(this.openRound.bind(this)));
    eventEmitter.on("show-image-hint", () => {
      console.log("image-hint-show");
      this.playboardField.getComponent().classList.add("playboard__field-show-image");
    });
    eventEmitter.on("hide-image-hint", () => {
      this.playboardField.getComponent().classList.remove("playboard__field-show-image");
    });
    eventEmitter.on("source-block-filled", () => this.currentSentenceContainer?.classList.remove("check-mode"));
    eventEmitter.on("autocomplete", async () => {
      await this.currentSentence?.arrange(this.cardWordplacesResult);
      eventEmitter.emit("sentencearranged");
    });
    eventEmitter.on("sentencesolved-invalid-order", async () => {
      await this.currentSentence?.arrange(this.cardWordplacesResult);
      eventEmitter.emit("sentencesolved");
    });
    eventEmitter.on("image-revealed", () => this.playboardPuzzleContainer.clear());
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

  private checkSentence() {
    if (this.game) this.game.checkSentence(this.cardWordplacesResult);
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

  public async clearPlayboard() {
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

  private updateCardsContainers() {
    if (this.currentSentenceContainer) {
      if (!this.currentSentenceContainer.children.length) return;
      this.cardWordplacesResult = Array.from(this.currentSentenceContainer.children) as HTMLElement[];
    }
    if (!this.playboardSourceContainer.getComponent().children.length) return;
    this.cardWordplacesSource = Array.from(this.playboardSourceContainer.getComponent().children) as HTMLElement[];
  }

  public async openRound(level: number, round: number) {
    eventEmitter.emit("open-round");
    await this.clearPlayboard();
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
    playboardButtons.updateRoundLabel(level, round);
    imageInfo.close();
  }

  public loadSentence(idx: number) {
    if (!this.game) return;
    eventEmitter.emit("startsentence");
    this.currentCards = this.game.generateSources(idx);
    const resultArea = this.game.generateResultArea(idx);
    this.currentSentence = this.game.wordSentences[idx];
    hintsContainer.hints.translationHint?.setHint(this.game.info.words[idx].textExampleTranslate);
    hintsContainer.hints.audioHint?.setAudio(this.game.info.words[idx].audioExample);
    this.currentSentenceContainer = resultArea.getComponent();
    this.game.setCurrentSentence(this.game.wordSentences[idx]);
    this.cardWordplacesSource = this.game.generateWordsPlaces();
    this.resize();
    this.currentSentence.setSentenceContainer(resultArea.getComponent());
    this.cardWordplacesResult = resultArea.getContent();
    this.playboardSourceContainer.appendContent(this.cardWordplacesSource);
    this.playboardPuzzleContainer.append(resultArea);
    this.currentSentence.resizeContainers();
    this.addListenersToCards();
    this.currentCards.forEach((card) => {
      if (this.game) card.setBackground(this.game.info.levelData.imageSrc);
    });
  }

  private addListenersToCards() {
    this.currentCards.forEach((card) => {
      const draghandler = () => {
        if (!this.game) return;
        if (!this.currentSentence) return;
        if (card.draggable && card.curTarget instanceof HTMLElement)
          movesHandler.placeCardOndrop(card, card.curTarget, () => this.updateCardsContainers());
        this.updateCardsContainers();
        this.game.updateGameStats(this.cardWordplacesResult, this.cardWordplacesSource);
        this.resize();
      };
      card.addListener("mousedown", (e) => card.dragCard(e as MouseEvent, draghandler));
      card.addListener("touchstart", (e) => card.dragCard(e as TouchEvent, draghandler));
      card.addListener("click", () => {
        if (!this.game) return;
        if (!this.currentSentence) return;
        if (card.draggable) {
          card.unsetDraggable();
          return;
        }
        movesHandler.placeCardOnclick(card, this.cardWordplacesResult, this.cardWordplacesSource, () =>
          this.updateCardsContainers(),
        );
        this.game.updateGameStats(this.cardWordplacesResult, this.cardWordplacesSource);
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
