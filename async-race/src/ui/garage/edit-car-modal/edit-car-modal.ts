import "./edit-car-modal.css";
import Component from "../../../utils/component";
import { button, div, h3, input, svgSprite } from "../../../utils/elements";
import eventEmitter from "../../../utils/event-emitter";
import { ICarResponse } from "../../../types/response-interfaces";

class CarModal extends Component {
  input: Component<HTMLInputElement>;

  color: Component<HTMLInputElement>;

  carImage: SVGSVGElement;

  applyButton: Component<HTMLButtonElement>;

  closeButton: Component<HTMLButtonElement>;

  id: number = -1;

  public constructor() {
    super("div", ["overlay"]);
    this.input = input(["garage__control-input"], { type: "text", value: "" });
    this.carImage = svgSprite("./assets/car/sedan.svg#car0", "modal__image");
    this.applyButton = button(["modal__apply-button"], "APPLY");
    this.color = input(["garage__control-color"], { type: "color", value: "#000000" });
    this.color.addListener("input", () => this.applyColor());
    this.closeButton = button(["modal__close-button"], "CLOSE");
    this.applyButton.addListener("click", async () => {
      if (this.id === -1) return;
      eventEmitter.emit("edit-car", { id: this.id, name: this.getName(), color: this.getColor() });
      this.close();
    });
    this.closeButton.addListener("click", () => this.close());
    eventEmitter.on("open-edit-car-modal", (param) => {
      const obj = param as ICarResponse;
      this.openEdit(obj.id, obj.name, obj.color);
    });
  }

  getColor() {
    return this.color.getComponent().value;
  }

  getName() {
    return this.input.getComponent().value;
  }

  public openEdit(id: number, name: string, color: string) {
    this.append(
      div(
        ["modal"],
        h3(["modal__title"], "EDIT CAR"),
        this.carImage,
        div(["modal__inputs"], this.input, this.color),
        div(["modal__buttons"], this.closeButton, this.applyButton),
      ),
    );
    this.color.getComponent().value = color;
    this.applyColor();
    this.input.getComponent().value = name;
    this.id = id;
    document.body.append(this.getComponent());
  }

  public getId() {
    return this.id;
  }

  public applyColor() {
    this.carImage.style.fill = this.color.getComponent().value;
  }

  public close() {
    this.getComponent().remove();
    this.clearContainer();
  }
}

const carModal = new CarModal();

export default carModal;
