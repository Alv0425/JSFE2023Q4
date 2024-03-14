import { div } from "../../utils/elements";
import { IRound } from "../../utils/types/interfaces";
import Card from "./card";
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

  public constructor(info: IRound) {
    this.info = info;
    const levelid = info.levelData.id.split("_");
    this.roundIndex = parseInt(levelid[1], 10);
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

  public resetGameState() {
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
    const order = Array.from(
      { length: sentence.wordCards.length },
      (_, i) => i,
    ).sort(() => Math.random() - 0.5);
    const jumbledCards = order.map((i) => sentence.wordCards[order[i]]);
    this.state.currentSentence.sourceBlock = jumbledCards.map(
      (card) => card.wordIndex,
    );
    return jumbledCards;
  }

  public resizeAllCards(containerSize: { width: number; height: number }) {
    this.wordSentences.forEach((sentence) => {
      sentence.resizeCards(containerSize);
    });
  }

  public generateWordsPlaces(cards: Card[]) {
    return cards.map((card) => {
      const container = div(["wordplace", "placed"], card);
      container.setAttribute(
        "id",
        `source-${card.sentenceIdx}-${card.wordIndex}`,
      );
      return container.getComponent();
    });
  }

  public generateResultArea(sentenceIdx: number) {
    const sentenceContainer = div(["puzzle__sentence"]);
    const sentence = this.wordSentences[sentenceIdx];
    sentence.wordCards.forEach((card, idx) => {
      const droppable = div(["wordplace"]);
      droppable.setAttribute("id", `result-${sentenceIdx}-${idx}`);
      sentenceContainer.append(droppable);
    });
    return sentenceContainer;
  }

  public loadGameState(state: IGameState) {
    this.state = state;
  }
}

export default Game;
