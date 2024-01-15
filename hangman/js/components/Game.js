import { Human } from "./Human.js";
import { Alphabet } from "./Alphabet.js";
import { Modal } from "./Modal.js";
import { Sound } from "./Sound.js";
import { Layout } from "./Layout.js";
import { createNode, clearNode, checkLocalstorage, isLocalStorage } from "../auxiliary.js";
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
  // Random sequens of indexes
  generateRandomSequence(words) {
    this.size = words.length;
    this.words = words;
    this.sequence = Array.from({ length: this.size }, (_, i) => i).sort(
      () => Math.random() - 0.5,
    );
  }

  // Get randon index
  getRandomIndex() {
    if (isLocalStorage()) {
      return this.sequence.pop();
    }
    return Math.floor(Math.random() * this.size);
  }

  renderGameBoard() {
    if (isLocalStorage()) {
      checkLocalstorage();
    }
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
        this.playSound("erase");
      }
      this.renderNewGame();
    });
  }

  renderNewGame() {
    // reset fields
    this.numberOfGuesses = 0;
    clearNode(this.wordContainer);
    this.checkedLetters = [];
    this.scoreLabel.innerText = `Incorrect guesses: ${this.numberOfGuesses} / 6`;
    this.keyboard.forEach((key) => {
      key.classList.remove("key_correct");
      key.classList.remove("key_wrong");
      key.disabled = false;
    });
    // create new human
    this.human = new Human();
    const humanBody = this.human.render();
    this.gallows.append(humanBody);
    // check if current random sequence length is equal 0
    if (!this.sequence.length) {
      this.generateRandomSequence(this.words);
      // exclude random repeats
      if (isLocalStorage()){
        if (
          localStorage.hangmanprevnumber * 1 ===
          this.sequence[this.sequence.length - 1]
        ) {
          this.getRandomIndex();
        }
      }
    }
    let lastIndex = this.getRandomIndex();
    this.currentWord = this.words[lastIndex];
    if (isLocalStorage()) {
      localStorage.hangmanprevnumber = lastIndex;
    }
    console.log(`The secret word: ${this.currentWord.word.toUpperCase()}`);
    this.wordLetters = this.currentWord.word
      .split("")
      .map((l) => l.toUpperCase());
    // create array of invisible svg letters (shown as underscores)
    this.letters = this.wordLetters.map((letter) =>
      this.alphabet.render(letter),
    );
    this.wordContainer.append(...this.letters);
    // update hint text
    this.hint.innerText = this.currentWord.hint;
    // update filling of word by correct guesses (initial state -- all sites are false)
    this.filling = new Array(this.wordLetters.length).fill(false);
  }

  playSound(type) {
    let newSound = new Sound(type, this.isMuted);
    newSound.createSound();
    newSound.playSound();
  }

  renderKeyboard() {
    // generate array of all letters of EN alphabet
    const alph = Object.keys(this.alphabet.letters);
    const keys = [];
    // handle press on key
    const handleKeyEvt = (letter) => {
      if (!this.checkedLetters.includes(letter)) {
        let isIncorrectGuess = [true];
        for (let i = 0; i < this.wordLetters.length; i++) {
          // check all word letters, if guessed letter is equal the current one,
          // push it to isIncorrectGuess array and draw associated letter
          if (letter === this.wordLetters[i]) {
            isIncorrectGuess.push(false);
            this.checkedLetters.push(letter);
            this.filling[i] = letter;
            this.playSound("letter");
            this.letters[i].classList.add("letter_active");
            // block checked key
            this.keyboard[alph.indexOf(letter)].classList.add("key_correct");
            this.keyboard[alph.indexOf(letter)].disabled = true;
          }
        }
        // if all word letters are opened, generate win modal
        if (this.filling.every((e) => e)) {
          this.handleWin();
        }
        // if all checked letters are not equal pressed key,
        // draw new body part
        if (isIncorrectGuess.every((el) => el)) {
          this.handleIncorrectGuess(letter, alph);
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
          alert.button.onclick = () => alert.closeModal();
          this.isModalOpened = true;
          document.body.append(alert.overlay);
        }
      }
    });
    return keys;
  }

  handleIncorrectGuess(letter, alph) {
    if (this.numberOfGuesses < 6) {
      this.numberOfGuesses += 1;
      this.scoreLabel.innerText = `Incorrect guesses: ${this.numberOfGuesses} / 6`;
      this.human.parts[this.numberOfGuesses - 1].classList.add(
        "human__part_visible",
      );
      if (this.numberOfGuesses === 1) {
        this.playSound("circle");
      } else {
        this.playSound("line");
      }
      this.keyboard[alph.indexOf(letter)].classList.add("key_wrong");
      this.keyboard[alph.indexOf(letter)].disabled = true;
      this.checkedLetters.push(letter);
      // if number of incorrect tries is equal to 6, finish game with lose modal
      if (this.numberOfGuesses === 6) {
        this.handleLose();
      }
    }
  }

  handleWin() {
    if (!this.isModalOpened) {
      this.isModalOpened = true;
      const newWin = new Modal("win");
      newWin.createModal();
      setTimeout(() => {
        this.playSound("win");
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

  handleLose() {
    if (!this.isModalOpened) {
      const newLose = new Modal("lose");
      newLose.createModal();
      setTimeout(() => {
        this.isModalOpened = true;
        this.playSound("lose");
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
