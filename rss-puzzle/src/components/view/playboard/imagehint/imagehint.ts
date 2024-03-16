import Component from "../../../../utils/component";
import { button } from "../../../../utils/elements";
import eventEmitter from "../../../../utils/eventemitter";
import createSvg from "../../../../utils/helpers/createsvg";
import "./imagehint.css";

class ImageHint {
  public hintToggler: Component<HTMLButtonElement>;

  public on: boolean = true;

  public constructor() {
    this.hintToggler = button(
      ["playboard__hint-image-toggler", "playboard__hint-image-toggler_active"],
      "",
      "button",
      "image-toggler",
    );
    const icon = createSvg("./assets/icons/image-solid.svg#image", "playboard__hint-toggler-icon");
    this.hintToggler.getComponent().append(icon);
    this.hintToggler.addListener("click", () => {
      if (this.on) {
        this.hintToggler.getComponent().classList.remove("playboard__hint-image-toggler_active");
        this.on = false;
        this.hideHint();
      } else {
        this.hintToggler.getComponent().classList.add("playboard__hint-image-toggler_active");
        this.on = true;
        this.showhint();
      }
    });
    if (this.on) this.showhint();
  }

  public showhint() {
    eventEmitter.emit("show-image-hint");
  }

  public hideHint() {
    eventEmitter.emit("hide-image-hint");
  }

  public getHintToggler() {
    return this.hintToggler;
  }
}

export default ImageHint;
