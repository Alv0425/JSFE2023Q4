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

  public constructor(info: IRound) {
    this.info = info;
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
    const jumbledCards = sentence.wordCards.sort(() => Math.random() - 0.5);
    this.state.currentSentence.sourceBlock = jumbledCards.map(
      (card) => card.wordIndex,
    );
    return jumbledCards;
  }

  public generateWordsPlaces(cards: Card[]) {
    return cards.map((card) => div(["wordplace"], card));
  }

  public generateResultArea(sentenceIdx: number) {
    const sentenceContainer = div(["puzzle__sentence"]);
    const sentence = this.wordSentences[sentenceIdx];
    sentence.wordCards.forEach((card, idx) => {
      const draggable = div(["wordplace"]);
      draggable.setAttribute("id", `${sentenceIdx}-${idx}`);
      sentenceContainer.append(draggable);
    });
    return sentenceContainer;
  }

  public loadGameState(state: IGameState) {
    this.state = state;
  }
}

export default Game;
