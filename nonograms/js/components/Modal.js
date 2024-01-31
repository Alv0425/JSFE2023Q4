import { Base } from "./Base.js";
export class Modal extends Base {
  constructor(type) {
    super();
    this.type = type;
    this.overlay = null;
    this.modal = null;
    this.modalBody = null;
  }
  openModal() {
    this.overlay = this.createNode("div", ["overlay"]);
    document.body.append(this.overlay);
    this.modal = this.createNode("div", ["modal", `modal_${this.type}`]);
    const modalHeader = this.createNode("div", ["modal__header"]);
    const modalTitle = this.createNode("h2", ["modal__title"]);
    const modalClose = this.createNode("button", ["modal__close"]);
    modalClose.append(this.createNode("span"), this.createNode("span"));
    modalHeader.append(modalTitle, modalClose);
    this.modalBody = this.createNode("div", ["modal__body"]);
    this.modal.append(modalHeader, this.modalBody);
    this.overlay.append(this.modal);
    modalClose.onclick = () => this.closeModal();
    if (this.type === "win") modalTitle.textContent = "Congrats!";
    if (this.type === "select") modalTitle.textContent = "Select Game";
  }
  closeModal() {
    this.overlay.classList.add("fade-out");
    setTimeout(() => {
      this.overlay.classList.remove("fade-out");
      this.overlay.remove();
    }, 500);
  }
}
