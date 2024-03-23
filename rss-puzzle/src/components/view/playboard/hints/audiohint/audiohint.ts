import "./audiohint.css";
import Component from "../../../../../utils/component";
import createSvg from "../../../../../utils/helpers/createsvg";
import { button } from "../../../../../utils/elements";
import datahandler from "../../../../services/datahandler";
import eventEmitter from "../../../../../utils/eventemitter";
import storage from "../../../../services/localstorage";

class AudioHint {
  private audioSource: string = "";

  private hintButton: Component;

  public on: boolean = true;

  public audio: HTMLAudioElement = new Audio();

  public hintToggler: Component<HTMLButtonElement>;

  public constructor() {
    this.hintButton = button(["playboard__hint-audio-button"], "", "button", "audio-button");
    const iconBtn1 = createSvg("./assets/icons/waves-1.svg#waves1", "playboard__audio-hint-icon-1");
    const iconBtn2 = createSvg("./assets/icons/waves-2.svg#waves2", "playboard__audio-hint-icon-2");
    this.hintButton.getComponent().append(iconBtn1, iconBtn2);
    this.hintButton.addListener("click", () => {
      if (this.audioSource) this.playAudio();
    });
    this.hintToggler = button(["playboard__hint-audio-toggler"], "", "button", "audio-toggler");
    const iconTgl = createSvg("./assets/icons/headphones-simple-solid.svg#headphones", "playboard__hint-toggler-icon");
    this.hintToggler.getComponent().append(iconTgl);
    this.hintToggler.addListener("click", () => {
      if (this.on) {
        this.hintToggler.getComponent().classList.remove("playboard__hint-audio-toggler_active");
        this.on = false;
        this.hideHint();
        this.saveOption();
      } else {
        this.hintToggler.getComponent().classList.add("playboard__hint-audio-toggler_active");
        this.on = true;
        this.showhint();
        this.saveOption();
      }
    });
    eventEmitter.on("sentencesolved", () => this.showhint());
    eventEmitter.on("sentencearranged", () => this.showhint());
    eventEmitter.on("startsentence", () => {
      this.hideHint();
      if (this.on) this.showhint();
    });
    const hintOptions = storage.getHintOptions();
    this.on = hintOptions.audioHint;
    if (this.on) this.hintToggler.getComponent().classList.add("playboard__hint-audio-toggler_active");
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

  public getHintToggler() {
    return this.hintToggler;
  }

  public saveOption() {
    const hintOptions = storage.getHintOptions();
    hintOptions.audioHint = this.on;
    storage.setHintOptions(hintOptions);
  }
}

export default AudioHint;
