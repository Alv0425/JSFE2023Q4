import "./selectlevels.css";
import Component from "../../../../utils/component";
import { button, div, h2, li, span, ul } from "../../../../utils/elements";
import eventEmitter from "../../../../utils/eventemitter";
import dataHandler from "../../../services/datahandler";
import { Modal } from "../../modal/modal";
import { ILevel, IRound, IRoundLevelInfo, IRoundResult } from "../../../../utils/types/interfaces";
import storage from "../../../services/localstorage";

export class SelectLevel {
  public button: Component;

  public modal: Modal;

  public constructor() {
    this.modal = new Modal();
    this.button = button(["button"], "Select Game", "submit", "select-level-button");
    this.button.addListener("click", () => {
      eventEmitter.emit("open-select-modal");
    });
  }

  public createRoundItem(roundData: IRound, roundIdx: number, levelIdx: number): Component<HTMLElement> {
    const currentRound: IRoundLevelInfo | null = storage.getCurrentRound();
    const container: Component<HTMLElement> = li(["round-item"]);
    const storedRoundData: IRoundResult | null = storage.getRoundStats(roundData.levelData.id);
    if (storedRoundData) container.getComponent().classList.add("round-item_solved");
    const words: Component<HTMLElement>[] = roundData.words.map((word, idx) => {
      const wordLabel: Component<HTMLElement> = span(["round-item__word"], word.word);
      if (storedRoundData?.knownWords.includes(idx)) wordLabel.getComponent().classList.add("round-item__word_solved");
      if (storedRoundData?.unknownWords.includes(idx))
        wordLabel.getComponent().classList.add("round-item__word_opened");
      return wordLabel;
    });
    const roundIndex: Component<HTMLElement> = div(["round-item__index"]);
    roundIndex.setTextContent(`${roundIdx + 1}`);
    const roundImage: Component<HTMLElement> = div(["round-item__image"]);
    roundImage.setStyleAttribute("background-image", `url(${dataHandler.getImageUrl(roundData.levelData.cutSrc)})`);
    const wordsContainer: Component<HTMLElement> = div(["round-item__words"], ...words);
    container.appendContent([roundIndex, roundImage, wordsContainer]);
    if (roundIdx === currentRound?.round && levelIdx === currentRound.level)
      container.getComponent().classList.add("round-item_current");
    return container;
  }

  public async loadRounds(
    roundsContainer: Component,
    level: number,
    callback: (round: number, level: number) => void,
  ): Promise<void> {
    const data: ILevel = await dataHandler.fetchLevelsData(level);
    roundsContainer.clear();
    data.rounds.forEach((round, index) => {
      const item: Component<HTMLElement> = this.createRoundItem(round, index, level);
      roundsContainer.append(item);
      item.addListener("click", () => {
        this.modal.closeModal();
        callback(level, index);
      });
    });
  }

  public openMmodalSelectGame(callback: (round: number, level: number) => void): void {
    document.body.append(this.modal.getComponent());
    const modalselect: Component<HTMLElement> = div(["modal", "modal_select"], h2(["modal__title"], "Select The Game"));
    this.modal.append(modalselect);
    const closeButton: Component<HTMLButtonElement> = button(["modal__levels-close"], "Close", "button", "close-btn");
    closeButton.addListener("click", () => this.modal.closeModal());
    const levelsTabs: Component<HTMLElement> = div(["modal__levels-container"]);
    const roundsContainer: Component<HTMLElement> = ul(["modal__rounds-container"]);
    const levelButtons: Component[] = [];
    [1, 2, 3, 4, 5, 6].forEach((level) => {
      const buttonLevel: Component<HTMLElement> = button(
        ["modal__level-button"],
        `level ${level}`,
        "button",
        `level-${level}`,
      );
      levelButtons.push(buttonLevel);
      buttonLevel.addListener("click", async () => {
        levelButtons.forEach((btn) => btn.getComponent().classList.remove("modal__level-button_active"));
        buttonLevel.getComponent().classList.add("modal__level-button_active");
        this.loadRounds(roundsContainer, level, callback);
      });
    });
    const currentRound: IRoundLevelInfo | null = storage.getCurrentRound();
    if (currentRound) {
      levelButtons[currentRound.level - 1].getComponent().classList.add("modal__level-button_active");
      this.loadRounds(roundsContainer, currentRound.level, callback);
    }
    levelsTabs.appendContent(levelButtons);
    modalselect.appendContent([levelsTabs, roundsContainer, closeButton]);
    levelButtons.forEach(async (btn, index) => {
      const isCompleted: boolean = await storage.checkLevelCompletion(index + 1);
      if (isCompleted) btn.getComponent().classList.add("modal__level-button_completed");
    });
  }
}

const selectLevel: SelectLevel = new SelectLevel();
export default selectLevel;
