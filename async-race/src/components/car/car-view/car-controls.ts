import type Component from "../../../utils/component";
import { button, svgSprite } from "../../../utils/elements";

class CarControls {
  public carEditButton: Component<HTMLButtonElement>;

  public carStopButton: Component<HTMLButtonElement>;

  public carRunButton: Component<HTMLButtonElement>;

  public carDeleteButton: Component<HTMLButtonElement>;

  constructor() {
    this.carEditButton = button(
      ["car__edit-button"],
      "",
      svgSprite("./assets/icons/pen-to-square-solid.svg#edit", "car__stop-icon"),
    );
    this.carDeleteButton = button(
      ["car__delete-button"],
      "",
      svgSprite("./assets/icons/trash-solid.svg#remove", "car__stop-icon"),
    );
    this.carRunButton = button(
      ["car__run-button"],
      "",
      svgSprite("./assets/icons/play-solid.svg#play", "car__stop-icon"),
    );
    this.carStopButton = button(
      ["car__stop-button"],
      "",
      svgSprite("./assets/icons/stop-solid.svg#stop", "car__stop-icon"),
    );
    this.carStopButton.getComponent().disabled = true;
    this.carStopButton.addListener("click", () => {
      this.carStopButton.getComponent().disabled = true;
    });
  }

  public lockControlsOnMove(): void {
    this.unlockAllControls();
    this.carRunButton.getComponent().disabled = true;
    this.carDeleteButton.getComponent().disabled = true;
    this.carEditButton.getComponent().disabled = true;
  }

  public lockAllControls(): void {
    this.carRunButton.getComponent().disabled = true;
    this.carDeleteButton.getComponent().disabled = true;
    this.carEditButton.getComponent().disabled = true;
    this.carStopButton.getComponent().disabled = true;
  }

  public unlockAllControls(): void {
    this.carRunButton.getComponent().disabled = false;
    this.carDeleteButton.getComponent().disabled = false;
    this.carEditButton.getComponent().disabled = false;
    this.carStopButton.getComponent().disabled = false;
  }

  public lockStopButton(): void {
    this.unlockAllControls();
    this.carStopButton.getComponent().disabled = true;
  }
}

export default CarControls;
