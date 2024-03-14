import eventEmitter from "../../utils/eventemitter";
import { IWord } from "../../utils/types/interfaces";
import Card from "./card";

class Sentence {
  public wordCards: Card[];

  public words: string[];

  public wordWeights: number[];

  public sentenceIdx: number;

  public constructor(sentence: IWord, idx: number) {
    this.words = sentence.textExample.split(" ");
    this.wordCards = this.words.map((word, index) => {
      const newCard = new Card(word, idx, index);
      return newCard;
    });
    const sentenceLength = this.words.join("").length;
    this.wordWeights = this.words.map(
      (word) => (word.length + 2) / (sentenceLength + 2 * this.words.length),
    );
    this.sentenceIdx = idx;
  }

  public resizeCards(containerSize: { width: number; height: number }) {
    this.wordCards.forEach((card, idx) => {
      card.setWidth(containerSize, this.wordWeights[idx]);
    });
    eventEmitter.emit("cardsresized");
  }
}

export default Sentence;
