import "./translationhint.css";
import Component from "../../../../utils/component";
import { div, p } from "../../../../utils/elements";

class TranslationHint {
  private hintText: Component;

  public hintContainer: Component<HTMLElement>;

  public constructor() {
    this.hintContainer = div(["playboard__translation-hint"]);
    this.hintText = p(["playboard__hint-label"], "");
    this.hintContainer.append(this.hintText);
  }

  public setHint(hintText: string) {
    this.hintContainer
      .getComponent()
      .classList.add("playboard__translation-hint_hide");
    setTimeout(() => {
      this.hintText.setTextContent(hintText);
      this.hintContainer
        .getComponent()
        .classList.remove("playboard__translation-hint_hide");
    }, 500);
  }

  public getHintContainer() {
    return this.hintContainer;
  }
}

export default TranslationHint;
