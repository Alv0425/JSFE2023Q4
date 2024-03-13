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

  public currentWidth: number = 0;

  public baseCircle: Component<HTMLElement>;

  public constructor(text: string, sentenceIdx: number, wordIndex: number) {
    super("div", ["card"]);
    this.text = text;
    this.baseCardLayer = div(["card__base"], div(["card__base-rect"]));
    this.baseCircle = div(["card__base-circle"]);
    this.baseCardLayer.append(this.baseCircle);
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
    this.currentWidth = Math.round(containerSize.width * weight);
    this.setStyleAttribute("width", `${this.currentWidth}px`);
    this.setStyleAttribute(
      "font-size",
      `${Math.round((containerSize.height * 0.38) / 10)}px`,
    );
    const parent = this.getComponent().parentElement;
    if (parent) parent.style.setProperty("width", `${this.currentWidth}px`);
  }

  public async animateMove(start: HTMLElement, finish: HTMLElement) {
    const startCoords = start.getBoundingClientRect();
    const finishCoords = finish.getBoundingClientRect();
    const shiftX = Math.round(finishCoords.x - startCoords.x);
    const shiftY = Math.round(finishCoords.y - startCoords.y);
    this.setStyleAttribute(
      "transform",
      `translateX(${shiftX}px) translateY(${shiftY}px)`,
    );
    return new Promise((res) => {
      setTimeout(() => {
        res(true);
        this.removeStyleAttribute("transform");
      }, 500);
    });
  }
}

export default Card;
