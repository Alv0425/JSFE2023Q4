import "./selectlevels.css";
import Component from "../../../../utils/component";
import { button, div, h2, li, span, ul } from "../../../../utils/elements";
import eventEmitter from "../../../../utils/eventemitter";
import dataHandler from "../../../services/datahandler";
import { Modal } from "../../modal/modal";
import { IRound } from "../../../../utils/types/interfaces";

class SelectLevel {
  public button: Component;

  public modal: Modal;

  public constructor() {
    this.modal = new Modal();
    this.button = button(["button"], "Select Level", "submit", "select-level-button");
    this.button.addListener("click", () => {
      eventEmitter.emit("open-select-modal");
    });
  }

  public createRoundItem(roundData: IRound, index: number) {
    const container = li(["round-item"]);
    const words = roundData.words.map((word) => span(["round-item__word"], word.word));
    const roundIndex = div(["round-item__index"]);
    roundIndex.setTextContent(`${index + 1}`);
    const roundImage = div(["round-item__image"]);
    roundImage.setStyleAttribute("background-image", `url(${dataHandler.getImageUrl(roundData.levelData.cutSrc)})`);
    const wordsContainer = div(["round-item__words"], ...words);
    container.appendContent([roundIndex, roundImage, wordsContainer]);
    return container;
  }

  public async loadRounds(roundsContainer: Component, level: number, callback: (round: number, level: number) => void) {
    const data = await dataHandler.fetchLevelsData(level);
    roundsContainer.clear();
    data.rounds.forEach((round, index) => {
      const item = this.createRoundItem(round, index);
      roundsContainer.append(item);
      item.addListener("click", () => {
        this.modal.closeModal();
        callback(level, index);
      });
    });
  }

  public openMmodalSelectGame(callback: (round: number, level: number) => void) {
    document.body.append(this.modal.getComponent());
    const modalselect = div(["modal", "modal_select"], h2(["modal__title"], "Select The Game"));
    this.modal.append(modalselect);
    const closeButton = button(["modal__levels-close"], "Close", "button", "close-btn");
    closeButton.addListener("click", () => this.modal.closeModal());
    const levelsTabs = div(["modal__levels-container"]);
    const roundsContainer = ul(["modal__rounds-container"]);
    const levelButtons: Component[] = [];
    [1, 2, 3, 4, 5, 6].forEach((level) => {
      const buttonLevel = button(["modal__level-button"], `level ${level}`, "button", `level-${level}`);
      levelButtons.push(buttonLevel);
      buttonLevel.addListener("click", async () => {
        levelButtons.forEach((btn) => btn.getComponent().classList.remove("modal__level-button_active"));
        buttonLevel.getComponent().classList.add("modal__level-button_active");
        this.loadRounds(roundsContainer, level, callback);
      });
    });
    levelButtons[0].getComponent().classList.add("modal__level-button_active");
    this.loadRounds(roundsContainer, 1, callback);
    levelsTabs.appendContent(levelButtons);
    modalselect.appendContent([levelsTabs, roundsContainer, closeButton]);
  }
}

export default SelectLevel;
