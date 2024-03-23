import Component from "../../utils/component";
import { getElementOfType } from "../../utils/helpers/getelementoftype";
import { ComponentType } from "../../utils/types/interfaces";
import Card from "../game/card";

class MovesHandler {
  public swapPlaces(place1: HTMLElement, place2: HTMLElement, callback: () => void) {
    if (place1 === place2) return;
    const elementLeftSibling = place2.previousSibling;
    const elementRightSibling = place2.previousSibling;
    place1.before(place2);
    if (elementLeftSibling) {
      elementLeftSibling.after(place1);
    } else if (elementRightSibling) {
      elementRightSibling.before(place1);
    }
    callback();
  }

  public findPlace(card: Card, resultContainers: ComponentType[], sourceContainers: ComponentType[]) {
    let i = 0;
    let cardContainer = getElementOfType(HTMLElement, resultContainers[0]);
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

  public insertCard(card: Card, dest: HTMLElement, target: HTMLElement, destType: string) {
    if (dest) {
      const parent = card.getComponent().parentElement;
      if (!parent) return;
      parent.classList.remove("placed");
      dest.append(card.getComponent());
      if (card.isLeftSideTarget(target)) {
        target.before(dest);
      } else {
        target.after(dest);
      }
      dest.classList.add("placed");
      const cardComp = card;
      card.unsetCoordinates();
      cardComp.draggable = false;
      target?.classList.remove("highlight");
      if (destType === "result" || destType === "source") cardComp.position = destType;
    }
  }

  public async placeCardOndrop(card: Card, target: HTMLElement | null, callback: () => void) {
    let destType = "result";
    const targetID = target?.getAttribute("id");
    if (targetID) destType = targetID.split("-")[0];
    const dest = document.getElementById(`${destType}-${card.sentenceIdx}-${card.wordIndex}`);
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
  ) {
    let cardContainer = target;
    if (dest) {
      this.swapPlaces(target, dest, callback);
      cardContainer = dest;
    }
    if (!(card instanceof Component)) return;
    const parent = card.getComponent().parentElement;
    if (!parent) return;
    parent.classList.remove("placed");
    cardContainer.classList.add("placed");
    target?.classList.remove("highlight");
    if (isAnimate) await card.moveTo(cardContainer.getBoundingClientRect().x, cardContainer.getBoundingClientRect().y);
    cardContainer.append(card.getComponent());
  }

  public async placeCard(card: Card, target: HTMLElement | null, callback: () => void) {
    card.unsetCoordinates();
    const destType = card.position === "result" ? "source" : "result";
    const dest = document.getElementById(`${destType}-${card.sentenceIdx}-${card.wordIndex}`);
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
  ) {
    card.unsetCoordinates();
    const target = this.findPlace(card, resultContainers, sourceContainers);
    const destType = card.position === "result" ? "source" : "result";
    const dest = document.getElementById(`${destType}-${card.sentenceIdx}-${card.wordIndex}`);
    if (!target) return;
    if (dest) this.changePosition(card, target, dest, true, callback);
    card.unsetDraggable();
    card.setPosition(card.position === "result" ? "source" : "result");
  }
}

const movesHandler = new MovesHandler();

export default movesHandler;
