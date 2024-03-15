import "./card.css";
import Component from "../../utils/component";
import { div, span } from "../../utils/elements";
// import eventEmitter from "../../utils/eventemitter";
import { getElementOfType } from "../../utils/helpers/getelementoftype";
// import eventEmitter from "../../utils/eventemitter";

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

  public draggable: boolean;

  public curTarget: HTMLElement | Element | null = null;

  public borderCircle: Component<HTMLElement>;

  public constructor(text: string, sentenceIdx: number, wordIndex: number) {
    super("div", ["card"]);
    this.text = text;
    this.baseCardLayer = div(["card__base"], div(["card__base-rect"]));
    this.baseCircle = div(["card__base-circle"]);
    this.borderCircle = div(["card__border-circle"]);
    this.baseCardLayer.append(this.baseCircle);
    this.baseImageLayer = div(["card__image"]);
    this.textCardLayer = span(["card__text"], text);
    this.appendContent([
      this.baseCardLayer,
      this.baseImageLayer,
      this.textCardLayer,
      this.borderCircle,
    ]);
    this.sentenceIdx = sentenceIdx;
    this.wordIndex = wordIndex;
    this.position = "source";
    this.draggable = false;
    this.addListener("dragstart", (e) => e.preventDefault());
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
      "height",
      `${Math.round(containerSize.height * 0.1)}px`,
    );
    this.setStyleAttribute(
      "font-size",
      `${Math.round((containerSize.height * 0.38) / 10)}px`,
    );
    const parent = this.getComponent().parentElement;
    if (parent) parent.style.setProperty("width", `${this.currentWidth}px`);
    this.baseCircle.setStyleAttribute(
      "mask",
      `radial-gradient(0.6em at calc(${this.currentWidth}px - 0.6em) 50%, #000 90%, transparent 100%)`,
    );
  }

  public async moveTo(x: number, y: number) {
    const startCoords = this.getComponent().getBoundingClientRect();
    const shiftX = Math.round(x - startCoords.x);
    const shiftY = Math.round(y - startCoords.y);
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

  public setCoordinates(x: number, y: number) {
    this.setStyleAttribute("transition", "0s");
    this.setStyleAttribute("position", "relative");
    this.setStyleAttribute("left", `${x}px`);
    this.setStyleAttribute("top", `${y}px`);
    this.setStyleAttribute("z-index", "10");
  }

  public unsetCoordinates() {
    this.removeStyleAttribute("transition");
    this.setStyleAttribute("left", "0px");
    this.setStyleAttribute("top", "0px");
    this.removeStyleAttribute("z-index");
  }

  public checkElementBelow(x: number, y: number) {
    this.hide();
    const element = document.elementFromPoint(x, y);
    this.show();
    if (!element) return;
    const droppable = element.closest(".wordplace");
    if (this.curTarget !== droppable) {
      if (this.curTarget) {
        this.curTarget.classList.remove("highlight");
      }
      this.curTarget = droppable;
      if (this.curTarget) {
        this.curTarget.classList.add("highlight");
      }
    }
  }

  public swapPlaces(place1: HTMLElement, place2: HTMLElement) {
    if (place1 === place2) return;
    const elementLeftSibling = place2.previousSibling;
    const elementRightSibling = place2.previousSibling;
    place1.before(place2);
    if (elementLeftSibling) {
      elementLeftSibling.after(place1);
    } else if (elementRightSibling) {
      elementRightSibling.before(place1);
    }
  }

  private isInsideField(x: number, y: number) {
    const fieldCoords = getElementOfType(
      HTMLElement,
      document.querySelector(".playboard__field"),
    ).getBoundingClientRect();
    if (x < fieldCoords.x || y < fieldCoords.y) return false;
    if (
      x > fieldCoords.x + fieldCoords.width ||
      y > fieldCoords.y + fieldCoords.width
    )
      return false;
    return true;
  }

  public getCoords(e: MouseEvent | TouchEvent) {
    const coord = { x: 0, y: 0 };
    if (e instanceof TouchEvent) {
      coord.x = e.touches[0].clientX;
      coord.y = e.touches[0].clientY;
    } else if (e instanceof MouseEvent) {
      coord.x = e.clientX;
      coord.y = e.clientY;
    }
    return coord;
  }

  public dragCardMouse(event: MouseEvent, drophandler: () => void) {
    const startCoords = this.getComponent().getBoundingClientRect();
    const shiftX =
      event.clientX - this.getComponent().getBoundingClientRect().left;
    const shiftY =
      event.clientY - this.getComponent().getBoundingClientRect().top;
    const move1 = (e: MouseEvent) => {
      if (shiftX > 5 || shiftY > 5) this.draggable = true;
      const coord = this.getCoords(e);
      this.setCoordinates(
        coord.x - startCoords.x - shiftX,
        coord.y - startCoords.y - shiftY,
      );
      this.checkElementBelow(coord.x, coord.y);
    };
    document.body.addEventListener("mousemove", move1);
    document.body.addEventListener("mouseup", () => {
      document.body.removeEventListener("mousemove", move1);
      if (this.draggable) {
        this.unsetCoordinates();
        if (this.curTarget) drophandler();
      }
      this.unsetCoordinates();
    });
  }

  public dragCardTouch(event: TouchEvent, drophandler: () => void) {
    const startCoords = this.getComponent().getBoundingClientRect();
    const shiftX =
      event.touches[0].clientX -
      this.getComponent().getBoundingClientRect().left;
    const shiftY =
      event.touches[0].clientY -
      this.getComponent().getBoundingClientRect().top;
    const move = (e: TouchEvent) => {
      document.body.classList.add("fixed");
      if (shiftX > 5 || shiftY > 5) this.draggable = true;
      const coord = this.getCoords(e);
      this.setCoordinates(
        coord.x - startCoords.x - shiftX,
        coord.y - startCoords.y - shiftY,
      );
      this.checkElementBelow(coord.x, coord.y);
    };
    document.body.addEventListener("touchmove", move);
    document.body.addEventListener("touchend", () => {
      document.body.classList.remove("fixed");
      document.body.removeEventListener("touchmove", move);
      if (this.draggable) {
        this.unsetCoordinates();
        if (this.curTarget) drophandler();
      }
      this.unsetCoordinates();
    });
  }
}

export default Card;
