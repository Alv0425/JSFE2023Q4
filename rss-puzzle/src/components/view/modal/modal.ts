import "./modal.css";
import Component from "../../../utils/component";
import { button, div, h2, p } from "../../../utils/elements";
import eventEmitter from "../../../utils/eventemitter";
import loader from "../loaderscreen/loader";

class Modal extends Component {
  public constructor() {
    super("div", ["overlay"]);
  }

  private closeModal() {
    this.getComponent().classList.add("fade-out");
    setTimeout(() => {
      this.getComponent().classList.remove("fade-out");
      this.destroy();
    }, 500);
  }

  public openMmodalLogout() {
    document.body.append(this.getComponent());
    const modalLogout = div(
      ["modal", "modal_logout"],
      h2(["modal__title"], "Are you sure?"),
      p(
        ["modal__text"],
        "Logging out will remove all of your saved data and progress in localStorage.",
      ),
    );
    const closeButton = button(
      ["modal__button"],
      "close",
      "button",
      "close-btn",
    );
    closeButton.addListener("click", () => this.closeModal());
    const logoutButton = button(
      ["modal__button"],
      "logout",
      "button",
      "logout-btn",
    );
    logoutButton.addListener("click", () => {
      this.closeModal();
      loader.draw();
      loader.close();
      eventEmitter.emit("logout");
    });
    const modalButtons = div(
      ["modal__buttons-container"],
      closeButton,
      logoutButton,
    );
    modalLogout.appendContent([modalButtons]);
    this.append(modalLogout);
  }
}

const modal = new Modal();

export default modal;
