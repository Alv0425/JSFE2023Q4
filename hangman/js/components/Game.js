import { Human } from "./Human.js";
import { Alphabet } from "./Alphabet.js";
import { Modal } from "./Modal.js";
import { Sound } from "./Sound.js";
import { clearNode } from "../auxiliary.js";
export class Game {
  constructor() {
    this.sequence = [];
    this.words = [];
    this.size = 0;
    this.wordLetters = [];
    this.filling = [];
    this.alphabet = new Alphabet();
    this.gallows = null;
    this.keyboard = null;
    this.hint = "";
    this.wordContainer = null;
    this.currentWord = null;
    this.letters = null;
    this.human = null;
    this.checkedLetters = [];
    this.scoreLabel = null;
    this.numberOfGuesses = 0;
    this.isModalOpened = false;
    this.isMuted = false;
  }
  generateSequence(words) {
    this.size = words.length;
    this.words = words;
    this.sequence = Array.from({ length: this.size }, (_, i) => i).sort(
      () => Math.random() - 0.5,
    );
  }
  renderGameBoard() {
    console.log(
      `Пожалуйста, не забудьте переключить раскладку клавиатуры на EN!`,
    );
    const body = document.body;
    body.classList.add("body");
    let numberOfGuesses = 0;
    const header = this.createNode("header", ["header"]);
    const headerContainer = this.createNode("div", [
      "header__container",
      "wrapper",
    ]);
    const headerLogo = this.createNode("h1", ["header__logo"], {}, "HANGMAN");
    const mutedToggler = this.createNode("button", ["header__toggler"]);
    mutedToggler.onclick = () => {
      const toggleEvent = new Event('mutetoggle');
      body.dispatchEvent(toggleEvent);
      this.isMuted = !this.isMuted;
      mutedToggler.classList.toggle("header__toggler_active");
    }
    const headerInfo = this.createNode("button", ["header__info"], {}, "i");
    if (!this.isModalOpened) {
      const infoModal = new Modal("info");
      infoModal.createModal();
      headerInfo.onclick = () => {
        this.isModalOpened = true;
        body.append(infoModal.overlay);
      };
      infoModal.button.onclick = () => {
        infoModal.closeModal();
        this.isModalOpened = false;
      };
    }

    headerContainer.append(headerLogo, mutedToggler, headerInfo);
    header.append(headerContainer);
    const main = this.createNode("main", ["main", "wrapper"]);
    const footer = this.createNode("footer", ["footer"]);
    body.append(header, main, footer);

    const footerContainer = this.createNode("div", [
      "footer__container",
      "wrapper",
    ]);
    const footerRSSLink = this.createNode("a", ["footer__rss-link"], {
      href: "https://rs.school/js/",
      target: "_blank",
    });
    const footerDate = this.createNode(
      "p",
      ["footer__date"],
      {},
      "Created in 2024 as part of an assignment from the Rolling Scopes School course",
    );
    const footerGithub = this.createNode(
      "a",
      ["footer__github"],
      { href: "https://github.com/Alv0425", target: "_blank" },
      "alv0425",
    );
    footerContainer.append(footerRSSLink, footerDate, footerGithub);
    footer.append(footerContainer);

    const gameContainer = this.createNode("div", ["hangman"]);
    const playBoard = this.createNode("div", ["hangman__playboard"]);
    const riddle = this.createNode("div", ["hangman__riddle"]);
    this.keyboard = this.createNode("div", ["hangman__keyboard"]);
    this.scoreLabel = this.createNode(
      "p",
      ["hangman__label"],
      {},
      `Incorrect guesses: ${numberOfGuesses} / 6`,
    );
    this.wordContainer = this.createNode("div", ["hangman__word"]);
    this.hint = this.createNode("p", ["hangman__hint"], {}, "Some text");
    this.gallows = this.createNode("div", ["hangman__gallows"]);
    gameContainer.append(playBoard, this.keyboard);
    playBoard.append(this.gallows, riddle);
    riddle.append(this.scoreLabel, this.wordContainer, this.hint);
    main.append(gameContainer);
    const keys = this.renderKeyboard();
    this.keyboard.append(...keys);
    this.keyboard = keys;
    this.renderNewGame();
    document.body.addEventListener("modalclosed", () => {
      this.isModalOpened = false;
    });
    document.body.addEventListener("modalclosedwin", () => {
      this.human.erase();
      let newSound = new Sound('erase', this.isMuted);
      newSound.createSound();
      newSound.playSound();
      this.renderNewGame();
    });
  }

  renderNewGame() {
    this.numberOfGuesses = 0;
    clearNode(this.wordContainer);
    this.checkedLetters = [];
    this.scoreLabel.innerText = `Incorrect guesses: ${this.numberOfGuesses} / 6`;
    this.keyboard.forEach((key) => {
      key.classList.remove("key_correct");
      key.classList.remove("key_wrong");
      key.disabled = false;
    });
    this.human = new Human();
    const humanBody = this.human.render();
    let newWord = "";
    if (!this.sequence.length) {
      this.generateSequence(this.words);
    }
    newWord = this.words[this.sequence.pop()];
    console.log(`The word guessed ${newWord.word.toUpperCase()}`);
    this.wordLetters = newWord.word.split("").map((l) => l.toUpperCase());
    this.gallows.append(humanBody);
    this.letters = this.wordLetters.map((letter) =>
      this.alphabet.render(letter),
    );
    this.wordContainer.append(...this.letters);
    this.hint.innerText = newWord.hint;
    this.filling = new Array(this.wordLetters.length).fill(false);
  }

  renderKeyboard() {
    const alph = Object.keys(this.alphabet.letters);
    const keys = [];
    const handleKeyEvt = (letter) => {
      if (!this.checkedLetters.includes(letter)) {
        let isIncorrectGuess = [true];
        for (let i = 0; i < this.wordLetters.length; i++) {
          if (letter === this.wordLetters[i]) {
            isIncorrectGuess.push(false);
            this.checkedLetters.push(letter);
            this.filling[i] = letter;
            let newSound = new Sound('letter', this.isMuted);
            newSound.createSound();
            newSound.playSound();
            this.letters[i].classList.add("letter_active");
            this.keyboard[alph.indexOf(letter)].classList.add("key_correct");
            this.keyboard[alph.indexOf(letter)].disabled = true;
          }
        }
        if (this.filling.every((e) => e)) {
          if (!this.isModalOpened) {
            this.isModalOpened = true;
            const newWin = new Modal("win");
            newWin.createModal();
            setTimeout(() => {
              let newSound = new Sound('win', this.isMuted);
              newSound.createSound();
              newSound.playSound();
              document.body.append(newWin.overlay);
            }, 700);
            let word = this.createNode("p", ["modal__text"]);
            word.innerText = `You guessed the word ${this.wordLetters.join("")}!`;
            newWin.button.before(
              "Congratulations!",
              word,
              `Number of incorrect guesses: ${this.numberOfGuesses}`,
            );
            newWin.button.onclick = () => newWin.closeModal();
          }
        }
        if (isIncorrectGuess.every((el) => el)) {
          if (this.numberOfGuesses < 6) {
            this.numberOfGuesses += 1;
            this.scoreLabel.innerText = `Incorrect guesses: ${this.numberOfGuesses} / 6`;
            this.human.parts[this.numberOfGuesses - 1].classList.add(
              "human__part_visible",
            );
            if (this.numberOfGuesses === 1) {
              let newSound = new Sound('circle', this.isMuted);
              newSound.createSound();
              newSound.playSound();
            } else {
              let newSound = new Sound('line', this.isMuted);
              newSound.createSound();
              newSound.playSound();
            }
            this.keyboard[alph.indexOf(letter)].classList.add("key_wrong");
            this.keyboard[alph.indexOf(letter)].disabled = true;
            this.checkedLetters.push(letter);
            if (this.numberOfGuesses === 6) {
              if (!this.isModalOpened) {
                const newLose = new Modal("lose");
                newLose.createModal();
                setTimeout(() => {
                  this.isModalOpened = true;
                  let newSound = new Sound('lose', this.isMuted);
                  newSound.createSound();
                  newSound.playSound();
                  document.body.append(newLose.overlay);
                }, 700);
                let text = this.createNode(
                  "p",
                  ["modal__text"],
                  {},
                  "Sorry, you ran out of tries.",
                );
                let word = this.createNode("p", ["modal__text"]);
                word.innerText = `The word was ${this.wordLetters.join("")}`;
                newLose.button.before(text, word);
                newLose.button.onclick = () => newLose.closeModal();
              }
            }
          }
        }
      }
    };
    Object.keys(this.alphabet.letters).forEach((letter) => {
      const newkey = document.createElement("button");
      newkey.innerText = letter;
      newkey.classList.add("key");
      newkey.onclick = () => {
        handleKeyEvt(letter);
      };
      keys.push(newkey);
    });
    window.addEventListener("keydown", (event) => {
      if (!this.isModalOpened) {
        let letter = event.key.toUpperCase();
        if (/[A-Z]{1}/.test(letter) && letter.length === 1) {
          handleKeyEvt(letter);
        } else if (/[А-Я]{1}/.test(letter)) {
          let alert = new Modal("error");
          alert.createModal();
          alert.button.onclick = () => {
            alert.closeModal();
          };
          this.isModalOpened = true;
          document.body.append(alert.overlay);
        }
      }
    });
    return keys;
  }

  createNode(type, classlist, attrlist, content) {
    let node;
    if (type) {
      node = document.createElement(type);
    }
    if (classlist) {
      node.classList.add(...classlist);
    }
    if (attrlist) {
      if (Object.keys(attrlist)) {
        for (let key in attrlist) {
          node.setAttribute(key, attrlist[key]);
        }
      }
    }
    if (content) {
      node.append(...content);
    }
    return node;
  }
}
