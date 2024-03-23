import "./translationhint.css";
import Component from "../../../../../utils/component";
import { button, div, p } from "../../../../../utils/elements";
import createSvg from "../../../../../utils/helpers/createsvg";
import eventEmitter from "../../../../../utils/eventemitter";
import storage from "../../../../services/localstorage";

class TranslationHint {
  private hintText: Component;

  public hintContainer: Component<HTMLElement>;

  public hintToggler: Component<HTMLButtonElement>;

  public on: boolean = true;

  public constructor() {
    this.hintContainer = div(["playboard__translation-hint"]);
    this.hintText = p(["playboard__hint-label"], "");
    this.hintContainer.append(this.hintText);
    this.hintToggler = button(["playboard__hint-translation-toggler"], "", "button", "translation-toggler");
    const icon = createSvg("./assets/icons/lightbulb-solid.svg#lightbulb", "playboard__hint-toggler-icon");
    this.hintToggler.getComponent().append(icon);
    this.hintToggler.addListener("click", () => {
      if (this.on) {
        this.hintToggler.getComponent().classList.remove("playboard__hint-translation-toggler_active");
        this.on = false;
        this.hideHint();
        this.saveOption();
      } else {
        this.hintToggler.getComponent().classList.add("playboard__hint-translation-toggler_active");
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
    this.on = hintOptions.translationHint;
    if (this.on) this.hintToggler.getComponent().classList.add("playboard__hint-translation-toggler_active");
  }

  public setHint(hintText: string) {
    this.hideHint();
    setTimeout(() => {
      this.hintText.setTextContent(hintText);
      if (this.on) this.showhint();
    }, 500);
  }

  public showhint() {
    this.hintContainer.getComponent().classList.remove("playboard__translation-hint_hide");
  }

  public hideHint() {
    this.hintContainer.getComponent().classList.add("playboard__translation-hint_hide");
  }

  public getHintContainer() {
    return this.hintContainer;
  }

  public getHintToggler() {
    return this.hintToggler;
  }

  public saveOption() {
    const hintOptions = storage.getHintOptions();
    hintOptions.translationHint = this.on;
    storage.setHintOptions(hintOptions);
  }
}

export default TranslationHint;
