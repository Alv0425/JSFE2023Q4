import "./modal.css";
import Component from "../../../utils/component";
import { button, div, h2, p } from "../../../utils/elements";
import eventEmitter from "../../../utils/eventemitter";
import loader from "../loaderscreen/loader";

export class Modal extends Component {
  public constructor() {
    super("div", ["overlay"]);
  }

  public closeModal(): void {
    this.getComponent().classList.add("fade-out");
    setTimeout(() => {
      this.getComponent().classList.remove("fade-out");
      this.destroy();
    }, 500);
  }

  public openMmodalLogout(): void {
    document.body.append(this.getComponent());
    const modalLogout: Component<HTMLElement> = div(
      ["modal", "modal_logout"],
      h2(["modal__title"], "Are you sure?"),
      p(["modal__text"], "Logging out will remove all of your saved data and progress in localStorage."),
    );
    const closeButton: Component<HTMLButtonElement> = button(["modal__button"], "close", "button", "close-btn");
    closeButton.addListener("click", () => this.closeModal());
    const logoutButton: Component<HTMLButtonElement> = button(["modal__button"], "logout", "button", "logout-btn");
    logoutButton.addListener("click", () => {
      this.closeModal();
      loader.draw();
      loader.close();
      eventEmitter.emit("logout");
    });
    const modalButtons: Component<HTMLElement> = div(["modal__buttons-container"], closeButton, logoutButton);
    modalLogout.appendContent([modalButtons]);
    this.append(modalLogout);
  }
}

const modal = new Modal();

export default modal;
