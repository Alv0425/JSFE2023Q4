import { Human } from "./Human.js";
import { Alphabet } from "./Alphabet.js";
import { Modal } from "./Modal.js";
import { Sound } from "./Sound.js";
import { Layout } from "./Layout.js";
import { createNode, clearNode, checkLocalstorage } from "../auxiliary.js";
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
    checkLocalstorage();
    const newLayout = new Layout(this);
    const body = document.body;
    body.classList.add("body");
    newLayout.renderHeader();
    newLayout.renderMain();
    newLayout.renderFooter();
    body.addEventListener("modalclosed", () => {
      this.isModalOpened = false;
    });
    body.addEventListener("modalclosedwin", () => {
      this.human.erase();
      if (this.numberOfGuesses > 0) {
        let newSound = new Sound("erase", this.isMuted);
        newSound.createSound();
        newSound.playSound();
      }
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
    if (!this.sequence.length) {
      this.generateSequence(this.words);
      if (
        localStorage.hangmanprevnumber ===
        this.sequence[this.sequence.length - 1]
      ) {
        this.sequence.pop();
      }
    }
    let lastIndex = this.sequence.pop();
    this.currentWord = this.words[lastIndex];
    localStorage.hangmanprevnumber = lastIndex;
    console.log(`The secret word: ${this.currentWord.word.toUpperCase()}`);
    this.wordLetters = this.currentWord.word
      .split("")
      .map((l) => l.toUpperCase());
    this.gallows.append(humanBody);
    this.letters = this.wordLetters.map((letter) =>
      this.alphabet.render(letter),
    );
    this.wordContainer.append(...this.letters);
    this.hint.innerText = this.currentWord.hint;
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
            let newSound = new Sound("letter", this.isMuted);
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
              let newSound = new Sound("win", this.isMuted);
              newSound.createSound();
              newSound.playSound();
              document.body.append(newWin.overlay);
            }, 700);
            let word = createNode("p", ["modal__text"]);
            word.innerText = `The word was ${this.wordLetters.join("")}!`;
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
              let newSound = new Sound("circle", this.isMuted);
              newSound.createSound();
              newSound.playSound();
            } else {
              let newSound = new Sound("line", this.isMuted);
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
                  let newSound = new Sound("lose", this.isMuted);
                  newSound.createSound();
                  newSound.playSound();
                  document.body.append(newLose.overlay);
                }, 700);
                let text = createNode(
                  "p",
                  ["modal__text"],
                  {},
                  "Sorry, you ran out of tries.",
                );
                let word = createNode("p", ["modal__text"]);
                word.innerText = `The word was ${this.wordLetters.join("")}`;
                let hint = createNode("p", ["modal__text"]);
                hint.innerText = this.currentWord.hint;
                newLose.button.before(text, word, hint);
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
    document.addEventListener("keydown", (event) => {
      if (!this.isModalOpened) {
        let letter = event.key.toUpperCase();
        if (/[A-Z]{1}/.test(letter) && letter.length === 1) {
          handleKeyEvt(letter);
        } else if (
          /[^\d\s\-_&%#?`~!@^'"{}=+.,\[;/\]\\]/.test(letter) &&
          letter.length === 1
        ) {
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
}
