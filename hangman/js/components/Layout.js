import { createNode } from "../auxiliary.js";
import { Modal } from "./Modal.js";
export class Layout {
  constructor(targetObject) {
    this.targetObject = targetObject;
  }
  renderHeader() {
    const header = createNode("header", ["header"]);
    const headerContainer = createNode("div", ["header__container", "wrapper"]);
    const headerLogo = createNode("h1", ["header__logo"], {}, "HANGMAN");
    const mutedToggler = createNode("button", ["header__toggler"]);
    mutedToggler.onclick = () => {
      const toggleEvent = new Event("mutetoggle");
      document.body.dispatchEvent(toggleEvent);
      this.targetObject.isMuted = !this.targetObject.isMuted;
      mutedToggler.classList.toggle("header__toggler_active");
    };
    const headerInfo = createNode("button", ["header__info"], {}, "i");
    if (!this.targetObject.isModalOpened) {
      const infoModal = new Modal("info");
      infoModal.createModal();
      headerInfo.onclick = () => {
        this.targetObject.isModalOpened = true;
        document.body.append(infoModal.overlay);
      };
      infoModal.button.onclick = () => {
        infoModal.closeModal();
        this.targetObject.isModalOpened = false;
      };
    }
    headerContainer.append(headerLogo, mutedToggler, headerInfo);
    header.append(headerContainer);
    document.body.append(header);
  }
  renderMain() {
    const main = createNode("main", ["main", "wrapper"]);
    const gameContainer = createNode("div", ["hangman"]);
    const playBoard = createNode("div", ["hangman__playboard"]);
    const riddle = createNode("div", ["hangman__riddle"]);
    this.targetObject.keyboard = createNode("div", ["hangman__keyboard"]);
    this.targetObject.scoreLabel = createNode(
      "p",
      ["hangman__label"],
      {},
      `Incorrect guesses: ${this.targetObject.numberOfGuesses} / 6`,
    );
    this.targetObject.wordContainer = createNode("div", ["hangman__word"]);
    this.targetObject.hint = createNode(
      "p",
      ["hangman__hint"],
      {},
      "Some text",
    );
    this.targetObject.gallows = createNode("div", ["hangman__gallows"]);
    gameContainer.append(playBoard, this.targetObject.keyboard);
    playBoard.append(this.targetObject.gallows, riddle);
    riddle.append(
      this.targetObject.scoreLabel,
      this.targetObject.wordContainer,
      this.targetObject.hint,
    );
    main.append(gameContainer);
    const keys = this.targetObject.renderKeyboard();
    this.targetObject.keyboard.append(...keys);
    this.targetObject.keyboard = keys;
    this.targetObject.renderNewGame();
    document.body.append(main);
  }
  renderFooter() {
    const footer = createNode("footer", ["footer"]);
    const footerContainer = createNode("div", ["footer__container", "wrapper"]);
    const footerRSSLink = createNode("a", ["footer__rss-link"], {
      href: "https://rs.school/js/",
      target: "_blank",
    });
    const footerDate = createNode(
      "p",
      ["footer__date"],
      {},
      "Created in 2024 as part of an assignment from the Rolling Scopes School course",
    );
    const footerGithub = createNode(
      "a",
      ["footer__github"],
      { href: "https://github.com/Alv0425", target: "_blank" },
      "alv0425",
    );
    footerContainer.append(footerRSSLink, footerDate, footerGithub);
    footer.append(footerContainer);
    document.body.append(footer);
  }
}
