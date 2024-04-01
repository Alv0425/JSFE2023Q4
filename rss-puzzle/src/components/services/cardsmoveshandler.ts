import Component from "../../utils/component";
import { getElementOfType } from "../../utils/helpers/getelementoftype";
import { ComponentType } from "../../utils/types/interfaces";
import Card from "../game/card";

class MovesHandler {
  public swapPlaces(place1: HTMLElement, place2: HTMLElement, callback: () => void): void {
    if (place1 === place2) return;
    const elementLeftSibling: ChildNode | null = place2.previousSibling;
    const elementRightSibling: ChildNode | null = place2.previousSibling;
    place1.before(place2);
    if (elementLeftSibling) {
      elementLeftSibling.after(place1);
    } else if (elementRightSibling) {
      elementRightSibling.before(place1);
    }
    callback();
  }

  public findPlace(
    card: Card,
    resultContainers: ComponentType[],
    sourceContainers: ComponentType[],
  ): HTMLElement | null {
    let i: number = 0;
    let cardContainer: HTMLElement = getElementOfType(HTMLElement, resultContainers[0]);
    let target: HTMLElement | null = null;
    while (i < resultContainers.length) {
      cardContainer = getElementOfType(HTMLElement, resultContainers[i]);
      if (card.position === "result") cardContainer = getElementOfType(HTMLElement, sourceContainers[i]);
      if (!cardContainer.classList.contains("placed")) {
        target = !target ? cardContainer : target;
        break;
      }
      i += 1;
    }
    return target;
  }

  public insertCard(card: Card, dest: HTMLElement, target: HTMLElement, destType: string): void {
    if (dest) {
      const parent: HTMLElement | null = card.getComponent().parentElement;
      if (!parent) return;
      parent.classList.remove("placed");
      dest.append(card.getComponent());
      if (card.isLeftSideTarget(target)) {
        target.before(dest);
      } else {
        target.after(dest);
      }
      dest.classList.add("placed");
      const cardComp: Card = card;
      card.unsetCoordinates();
      cardComp.draggable = false;
      target?.classList.remove("highlight");
      if (destType === "result" || destType === "source") cardComp.position = destType;
    }
  }

  public async placeCardOndrop(card: Card, target: HTMLElement | null, callback: () => void) {
    let destType: string = "result";
    const targetID: string | null | undefined = target?.getAttribute("id");
    if (targetID) [destType] = targetID.split("-");
    const dest: HTMLElement | null = document.getElementById(`${destType}-${card.sentenceIdx}-${card.wordIndex}`);
    if (!target) return;
    if (target?.classList.contains("placed")) {
      if (!dest) return;
      this.insertCard(card, dest, target, destType);
      return;
    }
    if (dest) await this.changePosition(card, target, dest, false, callback);
    card.unsetCoordinates();
    card.unsetDraggable();
    if (destType === "result" || destType === "source") card.setPosition(destType);
  }

  public async changePosition(
    card: Card,
    target: HTMLElement,
    dest: HTMLElement,
    isAnimate: boolean,
    callback: () => void,
  ): Promise<void> {
    let cardContainer: HTMLElement = target;
    if (dest) {
      this.swapPlaces(target, dest, callback);
      cardContainer = dest;
    }
    if (!(card instanceof Component)) return;
    const parent: HTMLElement | null = card.getComponent().parentElement;
    if (!parent) return;
    parent.classList.remove("placed");
    cardContainer.classList.add("placed");
    target?.classList.remove("highlight");
    if (isAnimate) await card.moveTo(cardContainer.getBoundingClientRect().x, cardContainer.getBoundingClientRect().y);
    cardContainer.append(card.getComponent());
  }

  public async placeCard(card: Card, target: HTMLElement | null, callback: () => void): Promise<void> {
    card.unsetCoordinates();
    const destType = card.position === "result" ? "source" : "result";
    const dest: HTMLElement | null = document.getElementById(`${destType}-${card.sentenceIdx}-${card.wordIndex}`);
    if (!target) return;
    if (dest) this.changePosition(card, target, dest, true, callback);
    card.unsetDraggable();
    card.setPosition(card.position === "result" ? "source" : "result");
  }

  public async placeCardOnclick(
    card: Card,
    resultContainers: ComponentType[],
    sourceContainers: ComponentType[],
    callback: () => void,
  ): Promise<void> {
    card.unsetCoordinates();
    const target: HTMLElement | null = this.findPlace(card, resultContainers, sourceContainers);
    const destType: "source" | "result" = card.position === "result" ? "source" : "result";
    const dest: HTMLElement | null = document.getElementById(`${destType}-${card.sentenceIdx}-${card.wordIndex}`);
    if (!target) return;
    if (dest) this.changePosition(card, target, dest, true, callback);
    card.unsetDraggable();
    card.setPosition(card.position === "result" ? "source" : "result");
  }
}

const movesHandler = new MovesHandler();

export default movesHandler;
