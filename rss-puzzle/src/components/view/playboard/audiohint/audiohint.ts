import "./audiohint.css";
import Component from "../../../../utils/component";
import createSvg from "../../../../utils/helpers/createsvg";
import { button } from "../../../../utils/elements";
import datahandler from "../../../services/datahandler";

class AudioHint {
  private audioSource: string = "";

  private hintButton: Component;

  public on: boolean = true;

  public audio: HTMLAudioElement = new Audio();

  public constructor() {
    this.hintButton = button(["playboard__hint-audio-button"], "", "button", "audio-button");
    const iconBtn1 = createSvg("./assets/icons/waves-1.svg#waves1", "playboard__audio-hint-icon-1");
    const iconBtn2 = createSvg("./assets/icons/waves-2.svg#waves2", "playboard__audio-hint-icon-2");
    this.hintButton.getComponent().append(iconBtn1, iconBtn2);
    this.hintButton.addListener("click", () => {
      if (this.audioSource) this.playAudio();
    });
  }

  public setHint(hintText: string) {
    this.hideHint();
    setTimeout(() => {
      this.hintButton.setTextContent(hintText);
      if (this.on) this.showhint();
    }, 500);
  }

  public showhint() {
    this.hintButton.getComponent().classList.remove("playboard__hint-audio-button_hide");
  }

  public hideHint() {
    this.hintButton.getComponent().classList.add("playboard__hint-audio-button_hide");
  }

  public setAudio(url: string) {
    this.audioSource = datahandler.getAudioUrl(url);
    this.audio = new Audio(this.audioSource);
    this.audio.load();
  }

  public playAudio() {
    if (!this.audioSource) return;
    this.hintButton.getComponent().classList.add("playboard__hint-audio-button_active");
    this.audio.currentTime = 0;
    this.audio.play();
    this.audio.addEventListener("ended", () => {
      this.hintButton.getComponent().classList.remove("playboard__hint-audio-button_active");
    });
  }

  public getHintButton() {
    return this.hintButton;
  }
}

export default AudioHint;
