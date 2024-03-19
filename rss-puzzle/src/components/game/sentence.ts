import eventEmitter from "../../utils/eventemitter";
import { IWord } from "../../utils/types/interfaces";
import Card from "./card";

class Sentence {
  public wordCards: Card[];

  public words: string[];

  public wordWeights: number[];

  public sentenceIdx: number;

  public sentenceLength: number;

  public constructor(sentence: IWord, idx: number) {
    this.words = sentence.textExample.split(" ");
    this.wordCards = this.words.map((word, index) => {
      const newCard = new Card(word, idx, index);
      return newCard;
    });
    this.wordCards[0].getComponent().classList.add("card_start");
    this.wordCards[this.wordCards.length - 1].getComponent().classList.add("card_end");
    this.sentenceLength = this.words.join("").length;
    this.wordWeights = this.words.map((word) => (word.length + 4) / (this.sentenceLength + 4 * this.words.length));
    this.sentenceIdx = idx;
  }

  private calculateShifts() {
    const currentCardsWidths = this.wordCards.map((card) => card.currentWidth);
    const shifts = [0];
    let shift = 0;
    for (let i = 0; i < this.wordCards.length - 1; i += 1) {
      shift += currentCardsWidths[i];
      shifts.push(shift);
    }
    return shifts;
  }

  public async animateArrangingCards(container: HTMLElement) {
    const baseCoords = container.getBoundingClientRect();
    const shifts = this.calculateShifts();
    this.wordCards.forEach((card, i) => card.moveTo(baseCoords.x + shifts[i], baseCoords.y));
  }

  public resizeCards(containerSize: { width: number; height: number }) {
    this.wordCards.forEach((card, idx) => {
      card.setWidth(containerSize, this.wordWeights[idx]);
      if (this.words.length > 9) {
        card.textCardLayer.setStyleAttribute("transform", "scale(0.9)");
      }
    });
    const shifts = this.calculateShifts();
    this.wordCards.forEach((card, idx) => {
      card.imageCardRect.setStyleAttribute(
        "background-position",
        `-${shifts[idx]}px -${Math.floor((containerSize.height * this.sentenceIdx) / 10)}px`,
      );
      const fontSize = (containerSize.height * 0.38) / 10;
      card.imageCardCircle.setStyleAttribute(
        "background-position",
        `-${shifts[idx] + Math.floor(fontSize * 0.75)}px -${Math.floor((containerSize.height * this.sentenceIdx) / 10)}px`,
      );
    });
    eventEmitter.emit("cardsresized");
  }
}

export default Sentence;
