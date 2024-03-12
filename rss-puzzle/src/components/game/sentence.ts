import { IWord } from "../../utils/types/interfaces";
import Card from "./card";

class Sentence {
  public wordCards: Card[];

  public words: string[];

  public constructor(sentence: IWord, idx: number) {
    this.words = sentence.textExample.split(" ");
    this.wordCards = this.words.map((word, index) => {
      const newCard = new Card(word, idx, index);
      return newCard;
    });
  }
}

export default Sentence;
