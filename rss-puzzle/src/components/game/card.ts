import "./card.css";
import Component from "../../utils/component";
import { div, span } from "../../utils/elements";

class Card extends Component<HTMLElement> {
  public text: string;

  public baseCardLayer: Component;

  public textCardLayer: Component<HTMLElement>;

  public baseImageLayer: Component<HTMLElement>;

  public wordIndex: number;

  public sentenceIdx: number;

  public position: "source" | "result";

  public constructor(text: string, sentenceIdx: number, wordIndex: number) {
    super("div", ["card"]);
    this.text = text;
    this.baseCardLayer = div(["card__base"]);
    this.baseImageLayer = div(["card__image"]);
    this.textCardLayer = span(["card__text"], text);
    this.appendContent([
      this.baseCardLayer,
      this.baseImageLayer,
      this.textCardLayer,
    ]);
    this.sentenceIdx = sentenceIdx;
    this.wordIndex = wordIndex;
    this.position = "source";
  }

  public getComponent() {
    return this.node;
  }

  public setWidth(
    containerSize: { width: number; height: number },
    weight: number,
  ) {
    this.setStyleAttribute(
      "width",
      `${Math.round(containerSize.width * weight)}px`,
    );
    this.setStyleAttribute(
      "font-size",
      `${Math.round((containerSize.height * 0.38) / 10)}px`,
    );
  }
}

export default Card;
