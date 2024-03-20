import "./statisticspage.css";
import Component from "../../../utils/component";
import { button, div, h2, h3, img, li, p, span, ul } from "../../../utils/elements";
import eventEmitter from "../../../utils/eventemitter";
import storage from "../../services/localstorage";
import { IRound, IRoundResult } from "../../../utils/types/interfaces";
import dataHandler from "../../services/datahandler";
import createSvg from "../../../utils/helpers/createsvg";

class StatisticsPage extends Component {
  public buttonsContainer: Component<HTMLElement>;

  public roundInfo: Component<HTMLElement>;

  public constructor() {
    super(
      "div",
      ["statistics-page"],
      {},
      {},
      div(["statistics-page__header"], h2(["statistics-page__header-title"], "Results")),
    );
    this.roundInfo = div(["statistics-page__results"]);
    this.buttonsContainer = div(["statistics-page__buttons"]);
    const backButton = button(["statistics-page__button"], "Back To Game", "button", "back-button");
    this.appendContent([this.roundInfo, this.buttonsContainer]);
    const continueButton = button(["statistics-page__button"], "Continue", "button", "results-continue-button");
    this.buttonsContainer.appendContent([backButton, continueButton]);
    backButton.addListener("click", () => this.closePage());
    continueButton.addListener("click", () => {
      this.closePage();
      eventEmitter.emit("continue-game");
    });
    eventEmitter.on("reveal-image", () => {
      console.log("button is disabled");
      continueButton.getComponent().disabled = true;
      setTimeout(() => {
        continueButton.getComponent().disabled = false;
      }, 2000);
    });
    eventEmitter.on("round-completed", () => this.updateResults());
  }

  public createSoundButton(url: string) {
    const srcUrl = dataHandler.getAudioUrl(url);
    const audio = new Audio(srcUrl);
    const audioButton = button(["playboard__hint-audio-button"], "", "button", "audio-button");
    const iconBtn1 = createSvg("./assets/icons/waves-1.svg#waves1", "playboard__audio-hint-icon-1");
    const iconBtn2 = createSvg("./assets/icons/waves-2.svg#waves2", "playboard__audio-hint-icon-2");
    audioButton.getComponent().append(iconBtn1, iconBtn2);
    audioButton.addListener("click", () => {
      if (srcUrl) {
        audioButton.getComponent().classList.add("playboard__hint-audio-button_active");
        audio.currentTime = 0;
        audio.play();
        audio.addEventListener(
          "ended",
          () => {
            audioButton.getComponent().classList.remove("playboard__hint-audio-button_active");
          },
          { once: true },
        );
      }
    });
    return audioButton;
  }

  public createImage(roundData: IRound) {
    return div(
      ["statistics-page__image-container"],
      img(["statistics-page__image"], dataHandler.getImageUrl(roundData.levelData.cutSrc), roundData.levelData.name),
      h3(["statistics-page__image-title"], `${roundData.levelData.name}`),
      p(["statistics-page__image-info"], `${roundData.levelData.author}, ${roundData.levelData.year}`),
    );
  }

  public createWordsList(currentRoundStats: IRoundResult, roundData: IRound, type: "knownWords" | "unknownWords") {
    return currentRoundStats[type].reduce((acc: Component[], wordIdx) => {
      if (roundData) {
        acc.push(
          li(
            ["statistics-page__results-item"],
            "",
            span(["statistics-page__results-item-text"], roundData.words[wordIdx].textExample),
            this.createSoundButton(roundData.words[wordIdx].audioExample),
          ),
        );
      }
      return acc;
    }, []);
  }

  public updateResults() {
    this.roundInfo.clear();
    const currentRound = storage.getCurrentRoundStats();
    const knownWordsContainer = div(
      ["statistics-page__results-container"],
      h3(["statistics-page__subtitle", "statistics-page__subtitle_known"], "I know"),
    );
    const unknownWordsContainer = div(
      ["statistics-page__results-container"],
      h3(["statistics-page__subtitle", "statistics-page__subtitle_unknown"], "I don't know"),
    );
    if (currentRound?.roundInfo) this.roundInfo.append(this.createImage(currentRound.roundInfo));
    if (!currentRound) return;
    if (currentRound.currentStats) {
      if (currentRound.currentStats.knownWords.length) {
        if (!currentRound.roundInfo) return;
        const wodsList = ul(
          ["statistics-page__results-list"],
          this.createWordsList(currentRound.currentStats, currentRound.roundInfo, "knownWords"),
        );
        knownWordsContainer.append(wodsList);
        this.roundInfo.append(knownWordsContainer);
      }
      if (currentRound.currentStats.unknownWords.length) {
        if (!currentRound.roundInfo) return;
        const wodsList = ul(
          ["statistics-page__results-list"],
          this.createWordsList(currentRound.currentStats, currentRound.roundInfo, "unknownWords"),
        );
        unknownWordsContainer.append(wodsList);
        this.roundInfo.append(unknownWordsContainer);
      }
    }
  }

  public closePage() {
    this.getComponent().classList.add("fade-out");
    setTimeout(() => {
      this.getComponent().classList.remove("fade-out");
      eventEmitter.emit("statistics-page-closed");
    }, 500);
  }
}

const statistics = new StatisticsPage();
export default statistics;
