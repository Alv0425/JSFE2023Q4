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
    this.wordCards[0].getComponent().classList.add("card_start");
    this.wordCards[this.wordCards.length - 1].getComponent().classList.add("card_end");
    const sentenceLength = this.words.join("").length;
    this.wordWeights = this.words.map((word) => (word.length + 2) / (sentenceLength + 2 * this.words.length));
    this.sentenceIdx = idx;
  }

  public async animateArrangingCards(container: HTMLElement) {
    const baseCoords = container.getBoundingClientRect();
    const currentCardsWidths = this.wordCards.map((card) => card.currentWidth);
    const shifts = [0];
    let shift = 0;
    for (let i = 0; i < this.wordCards.length - 1; i += 1) {
      shift += currentCardsWidths[i];
      shifts.push(shift);
    }
    this.wordCards.forEach((card, i) => card.moveTo(baseCoords.x + shifts[i], baseCoords.y));
  }

  public resizeCards(containerSize: { width: number; height: number }) {
    this.wordCards.forEach((card, idx) => {
      card.setWidth(containerSize, this.wordWeights[idx]);
    });
    eventEmitter.emit("cardsresized");
  }
}

export default Sentence;
