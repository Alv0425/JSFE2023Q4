import { createNode } from "../auxiliary.js";
export class Modal {
  constructor(type) {
    this.type = type;
    this.overlay = null;
    this.modal = null;
    this.button = null;
    this.isOpened = false;
    this.closeModalEvt;
  }
  createModal() {
    this.overlay = createNode("div", ["overlay"]);
    this.modal = createNode("div", ["modal", `modal_${this.type}`]);
    const modalHeader = createNode("div", ["modal__header"]);

    const modalTitle = createNode("h2", ["modal__title"]);
    const modalClose = createNode("button", ["modal__close"]);
    modalClose.append(createNode("span"), createNode("span"));
    modalHeader.append(modalTitle, modalClose);
    const modalBody = createNode("div", ["modal__body"]);
    const modalText = createNode("p", ["modal__text"]);
    this.modal.append(modalHeader, modalBody);
    this.overlay.append(this.modal);
    this.button = createNode("button", ["modal__button"]);
    modalClose.onclick = () => this.closeModal();
    this.overlay.addEventListener("click", (e) => {
      if (!this.modal.contains(e.target)) {
        this.closeModal();
      }
    });
    this.overlay.append(this.modal);
    switch (this.type) {
      case "error": {
        this.modal.classList.add('modal_error');
        modalTitle.innerText = "Error!";
        modalText.innerText =
          "It seems you are typing incorrect symbol. The word consist of letters from english alphabet, A-Z. Please, make sure you are using EN keyboard.";
        const shortcuts = createNode("p", ["modal__text"]);
        shortcuts.innerText =
          "To change the input language of the keyboard press the CTRL key and the SHIFT key at the same time (CTRL + SHIFT) on Windows devices. For Mac devices press CTRL + SPACE or CMD + SPACE";
        this.button.innerText = "OK";
        modalBody.append(modalText, shortcuts, this.button);
        break;
      }
      case "win":
        this.modal.classList.add('modal_result');
        modalTitle.innerText = "Correct!";
        this.button.innerText = "PLAY AGAIN";
        modalBody.append(this.button);
        break;
      case "lose":
        this.modal.classList.add('modal_result');
        modalTitle.innerText = "You lose =(";
        this.button.innerText = "PLAY AGAIN";
        modalBody.append(this.button);
        break;
      case "info": {
        this.modal.classList.add('modal_info');
        modalTitle.innerText = "HANGMAN GAME";
        modalText.innerText = "The HANGMAN game is popular word-guessing game.";
        const rules = createNode("p", "modal__text");
        rules.innerText =
          "RULES: Guess a letter in the word; if it's in the word, all the spots that match that letter fill in. For example, if the word was ABYSSAL, then, when no letters have been guessed, it would be _ _ _ _ _ _ _ . If the letter A is guessed, it becomes A _ _ _ _ A _ . If the player guesses wrong, a piece is added to the hangman person. When the entire human is built, the player loses.";
        const note = createNode("p", "modal__text");
        note.innerText =
          "NB: App works with physical keyboard. Please, make sure you are using EN keyboard. The word consist of letters A-Z of English alphabet only.";
        const linkMDN = createNode(
          "a",
          ["modal__link"],
          {
            target: "_blank",
            href: "https://developer.mozilla.org/en-US/docs/Glossary",
          },
          "MDN web docs glossary",
        );
        const linkLearnJS = createNode(
          "a",
          ["modal__link"],
          { target: "_blank", href: "https://javascript.info/" },
          "javascript.info",
        );
        const sources = createNode("p", "modal__text");
        sources.append(
          "in the game you are encouraged to guess for words on the topic related to web development. You can find most of definitions in ",
          linkMDN,
          " and ",
          linkLearnJS,
        );
        modalBody.append(modalText, rules, note, sources);
        break;
      }
    }
    return this.overlay;
  }
  closeModal() {
    this.closeModalEvt = new Event("modalclosed");
    document.body.dispatchEvent(this.closeModalEvt);
    const closeWin = new Event("modalclosedwin");
    if (this.type == "win" || this.type == "lose") {
      document.body.dispatchEvent(closeWin);
    }
    this.overlay.classList.add("fade-out");
    setTimeout(() => {
      this.overlay.classList.remove("fade-out");
    this.overlay.remove();

    } , 500);
  }
}
