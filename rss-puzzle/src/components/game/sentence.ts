import eventEmitter from "../../utils/eventemitter";
import { ComponentType, IWord } from "../../utils/types/interfaces";
import Card from "./card";

class Sentence {
  public wordCards: Card[];

  public words: string[];

  public wordWeights: number[];

  public sentenceIdx: number;

  public sentenceLength: number;

  protected sentenceContainer: ComponentType = null;

  constructor(sentence: IWord, idx: number) {
    this.words = sentence.textExample.split(" ");
    this.wordCards = this.words.map((word, index) => {
      const newCard: Card = new Card(word, idx, index);
      return newCard;
    });
    this.wordCards[0].getComponent().classList.add("card_start");
    this.wordCards[this.wordCards.length - 1].getComponent().classList.add("card_end");
    this.sentenceLength = this.words.join("").length;
    this.wordWeights = this.words.map((word) => (word.length + 4) / (this.sentenceLength + 4 * this.words.length));
    this.sentenceIdx = idx;
    eventEmitter.once("reveal-image", () => {
      this.wordCards.forEach((card) => {
        card.getComponent().classList.add("fade-out-slow");
        setTimeout(() => {
          const parent: HTMLElement | null = card.getComponent().parentElement;
          card.destroy();
          if (parent) parent.remove();
        }, 2000);
      });
    });
  }

  public setSentenceContainer(container: ComponentType): void {
    this.sentenceContainer = container;
  }

  public getSentenceContainer(): HTMLElement {
    return this.sentenceContainer as HTMLElement;
  }

  private calculateShifts(): number[] {
    return this.wordCards.reduce(
      (shifts, card) => {
        const shift = shifts[shifts.length - 1] + card.currentWidth;
        return [...shifts, shift];
      },
      [0],
    );
  }

  public async animateArrangingCards(container: HTMLElement): Promise<void> {
    const baseCoords: DOMRect = container.getBoundingClientRect();
    const shifts: number[] = this.calculateShifts();
    this.wordCards.forEach((card, i) => card.moveTo(baseCoords.x + shifts[i], baseCoords.y));
  }

  public resizeCards(containerSize: { width: number; height: number }): void {
    this.wordCards.forEach((card, idx) => {
      card.setWidth(containerSize, this.wordWeights[idx]);
      if (this.words.length > 9) {
        card.textCardLayer.setStyleAttribute("transform", "scale(0.8)");
      }
    });
    const shifts: number[] = this.calculateShifts();
    this.wordCards.forEach((card, idx) => {
      card.imageCardRect.setStyleAttribute(
        "background-position",
        `-${shifts[idx]}px -${Math.floor((containerSize.height * this.sentenceIdx) / 10)}px`,
      );
      const fontSize: number = (containerSize.height * 0.38) / 10;
      card.imageCardCircle.setStyleAttribute(
        "background-position",
        `-${shifts[idx] + Math.floor(fontSize * 0.75)}px -${Math.floor((containerSize.height * this.sentenceIdx) / 10)}px`,
      );
    });
    eventEmitter.emit("cardsresized");
  }

  public resizeContainers(): void {
    this.wordCards.forEach((card) => {
      const sourceContainer: HTMLElement | null = document.getElementById(
        `source-${card.sentenceIdx}-${card.wordIndex}`,
      );
      const resultContainer: HTMLElement | null = document.getElementById(
        `result-${card.sentenceIdx}-${card.wordIndex}`,
      );
      if (sourceContainer) sourceContainer.style.setProperty("width", `${card.currentWidth}px`);
      if (resultContainer) resultContainer.style.setProperty("width", `${card.currentWidth}px`);
      sourceContainer?.classList.remove("highlight");
      resultContainer?.classList.remove("highlight");
    });
  }

  public arrangeContainers(cardWordplacesResult: ComponentType[]): void {
    if (!this.sentenceContainer) return;
    cardWordplacesResult.sort((place1, place2) => {
      let id1: string | undefined;
      let id2: string | undefined;
      if (place1 instanceof HTMLElement) id1 = place1.getAttribute("id")?.split("-")[2];
      if (place2 instanceof HTMLElement) id2 = place2.getAttribute("id")?.split("-")[2];
      if (!id1 || !id2) return 0;
      return parseInt(id1, 10) - parseInt(id2, 10);
    });
    cardWordplacesResult.forEach((place, i) => {
      if (this.wordCards[i]) if (place) place.append(this.wordCards[i].getComponent());
      if (place instanceof HTMLElement) {
        place.remove();
        place.classList.add("placed", "correct");
        place.classList.add("error");
        if (this.sentenceContainer) this.sentenceContainer.append(place);
      }
    });
  }

  public async arrange(cardWordplacesResult: ComponentType[]): Promise<void> {
    if (!(this.sentenceContainer instanceof HTMLElement)) return;
    await this.animateArrangingCards(this.sentenceContainer);
    this.wordCards.forEach((card) => card.removeAllListeners());
    setTimeout(() => {
      this.arrangeContainers(cardWordplacesResult);
      if (this.sentenceContainer instanceof HTMLElement) this.sentenceContainer.classList.remove("check-mode");
    }, 500);
  }
}

export default Sentence;
