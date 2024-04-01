import "./card.css";
import Component, { IComponentCoordinates } from "../../utils/component";
import { div, span } from "../../utils/elements";
import dataHandler from "../services/datahandler";

class Card extends Component<HTMLElement> {
  private baseCardLayer: Component;

  public textCardLayer: Component<HTMLElement>;

  private baseImageLayer: Component<HTMLElement>;

  public position: "source" | "result";

  public currentWidth: number = 0;

  private baseCircle: Component<HTMLElement>;

  public draggable: boolean;

  public curTarget: HTMLElement | Element | null = null;

  private borderCircle: Component<HTMLElement>;

  public imageCardRect: Component<HTMLElement>;

  public imageCardCircle: Component<HTMLElement>;

  constructor(
    private text: string,
    public sentenceIdx: number,
    public wordIndex: number,
  ) {
    super("div", ["card"]);
    this.text = text;
    this.baseCardLayer = div(["card__base"], div(["card__base-rect"]));
    this.baseCircle = div(["card__base-circle"]);
    this.borderCircle = div(["card__border-circle"]);
    this.baseCardLayer.append(this.baseCircle);
    this.baseImageLayer = div(["card__image"]);
    this.imageCardRect = div(["card__image-rect"]);
    this.imageCardCircle = div(["card__image-circle"]);
    this.baseImageLayer.appendContent([this.imageCardRect, this.imageCardCircle]);
    this.textCardLayer = span(["card__text"], text);
    this.appendContent([this.baseCardLayer, this.baseImageLayer, this.textCardLayer, this.borderCircle]);
    this.sentenceIdx = sentenceIdx;
    this.wordIndex = wordIndex;
    this.position = "source";
    this.draggable = false;
    this.addListener("dragstart", (e) => e.preventDefault());
  }

  public setWidth(containerSize: { width: number; height: number }, weight: number): void {
    this.currentWidth = Math.round(containerSize.width * weight);
    this.setStyleAttribute("width", `${this.currentWidth}px`);
    this.setStyleAttribute("height", `${Math.round(containerSize.height * 0.1)}px`);
    this.setStyleAttribute("font-size", `${Math.round((containerSize.height * 0.38) / 10)}px`);
    const parent: HTMLElement | null = this.getComponent().parentElement;
    if (parent) parent.style.setProperty("width", `${this.currentWidth}px`);
    this.baseCircle.setStyleAttribute(
      "mask",
      `radial-gradient(0.6em at calc(${this.currentWidth}px - 0.6em) 50%, #000 90%, transparent 100%)`,
    );
    this.imageCardCircle.setStyleAttribute(
      "mask",
      `radial-gradient(0.55em at calc(${this.currentWidth}px - 0.6em) 50%, #000 90%, transparent 100%)`,
    );
    this.imageCardRect.setStyleAttribute("background-size", `${containerSize.width}px auto`);
    this.imageCardCircle.setStyleAttribute("background-size", `${containerSize.width}px auto`);
    this.textCardLayer.setStyleAttribute("transform", "scale(1)");
    if (Math.round((containerSize.height * 0.38) / 10) > 16)
      this.textCardLayer.setStyleAttribute("transform", "scale(0.8)");
  }

  public setBackground(url: string): void {
    const urlToImage: string = dataHandler.getImageUrl(url);
    this.imageCardCircle.setStyleAttribute("background-image", `url(${urlToImage})`);
    this.imageCardRect.setStyleAttribute("background-image", `url(${urlToImage})`);
  }

  public async moveTo(x: number, y: number): Promise<void> {
    const startCoords = this.getComponent().getBoundingClientRect();
    const shiftX = Math.round(x - startCoords.x);
    const shiftY = Math.round(y - startCoords.y);
    this.setStyleAttribute("transform", `translateX(${shiftX}px) translateY(${shiftY}px)`);
    const p = new Promise((res) => {
      setTimeout(() => {
        res(true);
        this.removeStyleAttribute("transform");
      }, 500);
    });
    await p;
  }

  public setCoordinates(x: number, y: number): void {
    this.setStyleAttribute("transition", "0s");
    this.setStyleAttribute("position", "relative");
    this.setStyleAttribute("left", `${x}px`);
    this.setStyleAttribute("top", `${y}px`);
    this.setStyleAttribute("z-index", "10");
  }

  public unsetCoordinates(): void {
    this.removeStyleAttribute("transition");
    this.setStyleAttribute("left", "0px");
    this.setStyleAttribute("top", "0px");
    this.removeStyleAttribute("z-index");
  }

  public checkElementBelow(x: number, y: number): void {
    this.hide();
    const element: Element | null = document.elementFromPoint(x, y);
    this.show();
    if (!element) return;
    const droppable: Element | null = element.closest(".wordplace");
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

  public getTargetCoords(e: Event): { x: number; y: number } {
    const coord: { x: number; y: number } = { x: 0, y: 0 };
    if (e instanceof TouchEvent) {
      coord.x = e.touches[0].clientX;
      coord.y = e.touches[0].clientY;
    } else if (e instanceof MouseEvent) {
      coord.x = e.clientX;
      coord.y = e.clientY;
    }
    return coord;
  }

  public dragCard(event: Event, drophandler: () => void): void {
    const startCoords: DOMRect = this.getComponent().getBoundingClientRect();
    const isMouseEvent: boolean = event instanceof MouseEvent;
    const shiftX: number = this.getTargetCoords(event).x - this.getCoordinates().x;
    const shiftY: number = this.getTargetCoords(event).y - this.getCoordinates().y;
    const move: (e: Event) => void = (e: Event) => {
      if (!isMouseEvent) document.body.classList.add("fixed");
      this.draggable = true;
      this.setCoordinates(
        this.getTargetCoords(e).x - startCoords.x - shiftX,
        this.getTargetCoords(e).y - startCoords.y - shiftY,
      );
      this.checkElementBelow(this.getCoordinates().centerX, this.getCoordinates().centerY);
    };

    const events: Record<string, keyof HTMLElementEventMap> = {
      move: isMouseEvent ? "mousemove" : "touchmove",
      end: isMouseEvent ? "mouseup" : "touchend",
    };
    document.body.addEventListener(events.move, move);
    document.body.addEventListener(events.end, () => {
      document.body.classList.remove("fixed");
      document.body.removeEventListener(events.move, move);
      if (this.draggable) {
        this.unsetCoordinates();
        if (this.curTarget) drophandler();
      }
      this.unsetCoordinates();
    });
  }

  public unsetDraggable(): void {
    this.draggable = false;
  }

  public setPosition(position: "source" | "result"): void {
    this.position = position;
  }

  public isLeftSideTarget(target: HTMLElement): boolean {
    const cardCoords: IComponentCoordinates = this.getCoordinates();
    const targetCoords: DOMRect = target.getBoundingClientRect();
    const centerOfTarget: number = targetCoords.left + targetCoords.width / 2;
    return cardCoords.centerX - centerOfTarget > 0;
  }
}

export default Card;
