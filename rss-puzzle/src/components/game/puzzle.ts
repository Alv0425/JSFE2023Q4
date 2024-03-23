import { div } from "../../utils/elements";
import eventEmitter from "../../utils/eventemitter";
import { getElementOfType } from "../../utils/helpers/getelementoftype";
import { ComponentType, IRound } from "../../utils/types/interfaces";
import Sentence from "./sentence";

interface ICurrentSentence {
  current: number;
  sourceBlock: number[];
  resultBlock: number[];
}

interface IGameState {
  isCurrent: boolean;
  isFinished: boolean;
  solvedSentences: number[];
  openedSentences: number[];
  currentSentence: ICurrentSentence;
}

class Game {
  public info: IRound;

  public wordSentences: Sentence[];

  public state: IGameState;

  public roundIndex: number;

  public levelIndex: number;

  private currentSentence: Sentence | null = null;

  public constructor(info: IRound) {
    this.info = info;
    const levelid = info.levelData.id.split("_");
    this.roundIndex = parseInt(levelid[1], 10) - 1;
    this.levelIndex = parseInt(levelid[0], 10);
    this.wordSentences = this.info.words.map((sentence, index) => {
      const sentenceObj = new Sentence(sentence, index);
      return sentenceObj;
    });
    this.state = {
      isCurrent: false,
      isFinished: false,
      solvedSentences: [],
      openedSentences: [],
      currentSentence: {
        current: 0,
        sourceBlock: [],
        resultBlock: [],
      },
    };
  }

  public generateSources(sentenceIdx: number) {
    const sentence = this.wordSentences[sentenceIdx];
    const jumbledCards = sentence.wordCards.slice();
    for (let i = jumbledCards.length - 1; i > 0; i -= 1) {
      const rand = Math.floor(Math.random() * (i + 1));
      [jumbledCards[i], jumbledCards[rand]] = [jumbledCards[rand], jumbledCards[i]];
    }
    return jumbledCards;
  }

  public setCurrentSentence(sentence: Sentence) {
    this.currentSentence = sentence;
  }

  public resizeAllCards(containerSize: { width: number; height: number }) {
    this.wordSentences.forEach((sentence) => {
      sentence.resizeCards(containerSize);
    });
  }

  public generateWordsPlaces() {
    if (!this.currentSentence) throw new Error("current sentence is undefined");
    return this.generateSources(this.currentSentence.sentenceIdx).map((card) => {
      const container = div(["wordplace", "placed"], card);
      container.setAttribute("id", `source-${card.sentenceIdx}-${card.wordIndex}`);
      return container.getComponent();
    });
  }

  public generateResultArea(sentenceIdx: number) {
    const sentenceContainer = div(["puzzle__sentence"]);
    const sentence = this.wordSentences[sentenceIdx];
    sentence.wordCards.forEach((_, idx) => {
      const droppable = div(["wordplace"]);
      droppable.setAttribute("id", `result-${sentenceIdx}-${idx}`);
      sentenceContainer.append(droppable);
    });
    return sentenceContainer;
  }

  public loadGameState(state: IGameState) {
    this.state = state;
  }

  public checkSentence(cardWordplacesResult: ComponentType[]) {
    if (!this.currentSentence) return;
    const correctWords = this.currentSentence.words;
    if (!correctWords) return;
    const actualWords = this.state.currentSentence.resultBlock.map((order) => {
      if (order === -1) return "";
      return correctWords[order];
    });
    const isCorrectOrder = this.state.currentSentence.resultBlock.every((order, idx) => idx === order);
    if (!actualWords) return;
    if (correctWords.join(" ") === actualWords.join(" ")) {
      if (isCorrectOrder) eventEmitter.emit("sentencesolved");
      if (!isCorrectOrder) eventEmitter.emit("sentencesolved-invalid-order");
      if (!(this.currentSentence.getSentenceContainer() instanceof HTMLElement)) return;
      this.currentSentence.getSentenceContainer().classList.remove("check-mode");
    }
    correctWords.forEach((word, i) => {
      getElementOfType(HTMLElement, cardWordplacesResult[i]).classList.remove("error");
      getElementOfType(HTMLElement, cardWordplacesResult[i]).classList.remove("correct");
      const correctness = actualWords[i] === word ? "correct" : "error";
      getElementOfType(HTMLElement, cardWordplacesResult[i]).classList.add(correctness);
    });
  }

  public setSolved() {
    if (!this.currentSentence) return;
    this.currentSentence.wordCards.forEach((card) => card.removeAllListeners());
    this.currentSentence.getSentenceContainer().classList.add("puzzle__sentence_correct");
    if (!this.state.solvedSentences.includes(this.currentSentence.sentenceIdx))
      this.state.solvedSentences.push(this.currentSentence.sentenceIdx);
    if (this.currentSentence.sentenceIdx === 9) eventEmitter.emit("round-completed");
  }

  public setArranged() {
    if (!this.currentSentence) return;
    this.currentSentence.wordCards.forEach((card) => card.removeAllListeners());
    this.currentSentence.getSentenceContainer().classList.add("puzzle__sentence_arranged");
    this.state.openedSentences.push(this.currentSentence.sentenceIdx);
    if (this.currentSentence.sentenceIdx === 9) eventEmitter.emit("round-completed");
  }

  public updateGameStats(cardWordplacesResult: ComponentType[], cardWordplacesSource: ComponentType[]) {
    if (!this.currentSentence) return;
    this.state.isCurrent = true;
    this.state.currentSentence.current = this.currentSentence.sentenceIdx;
    this.state.currentSentence.resultBlock = this.getCardIndices(cardWordplacesResult as HTMLElement[]);
    this.state.currentSentence.resultBlock = this.getCardIndices(cardWordplacesResult as HTMLElement[]);
    this.state.currentSentence.sourceBlock = this.getCardIndices(cardWordplacesSource as HTMLElement[]);
    if (this.state.currentSentence.sourceBlock.every((i) => i < 0)) {
      eventEmitter.emit("source-block-epmty");
    } else {
      eventEmitter.emit("source-block-filled");
    }
    this.checkSentence(cardWordplacesResult);
  }

  public getCardIndices(cards: HTMLElement[]): number[] {
    return cards.map((card) => {
      const cardElement = getElementOfType(HTMLElement, card);
      if (!cardElement.classList.contains("placed")) return -1;
      const wordIndex = cardElement.getAttribute("id")?.split("-")[2];
      return wordIndex ? parseInt(wordIndex, 10) : -1;
    });
  }
}

export default Game;
