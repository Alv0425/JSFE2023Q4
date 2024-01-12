import { Human } from "./Human.js";
import { Alphabet } from "./Alphabet.js";
import { clearNode } from "../auxiliary.js"
export class Game {
  constructor() {
    this.sequence = [];
    this.words = [];
    this.size = 0;
    this.wordLetters = [];
    this.filling = [];
    this.alphabet = new Alphabet;
    this.gallows = null;
    this.keyboard = null;
    this.hint = '';
    this.wordContainer = null;
    this.currentWord = null;
    this.letters = null;
    this.human = null;
    this.checkedLetters = [];
    this.numberOfGuesses = 0;
  }
  generateSequence(words) {
    this.size = words.length;
    this.words = words;
    this.sequence = Array.from({ length: this.size}, (_, i) => i).sort(() => Math.random() - 0.5);
    console.log(this.sequence)
  }
  renderGameBoard() {
    const body = document.body;
    body.classList.add("body");
    let numberOfGuesses = 0;
    const header = this.createNode("header", ["header"]);
    const headerContainer = this.createNode("div", ["header__container", "wrapper"]);
    const headerLogo = this.createNode("h1", ["header__logo"], {}, "HANGMAN");
    const headerInfo = this.createNode("button", ["header__info"], {}, "i");
    headerContainer.append(headerLogo, headerInfo);
    header.append(headerContainer);
    const main = this.createNode("main", ["main", "wrapper"]);
    const footer = this.createNode("footer", ["footer"]);
    body.append(header, main, footer);

    const footerContainer = this.createNode("div", ["footer__container", "wrapper"]);
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
    const scoreLabel = this.createNode(
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
    riddle.append(scoreLabel, this.wordContainer, this.hint);
    main.append(gameContainer);
    const keys = this.renderKeyboard();
    console.log(keys)
    this.keyboard.append(...keys);
    this.keyboard = keys;
    this.renderNewGame();
  }

  renderNewGame() {
    this.numberOfGuesses = 0;
    this.checkedLetters = [];
    this.keyboard.forEach((key) => {
      key.classList.remove("key_correct");
      key.classList.remove("key_wrong");
      key.disabled = false;
    });
    console.log(this.keyboard[0])
    this.human = new Human;
    const humanBody = this.human.render();
    let newWord = '';
    if (!this.sequence.length) {
      this.generateSequence(this.words);
    }
    newWord = this.words[this.sequence.pop()];
    this.wordLetters = newWord.word.split('').map((l) => l.toUpperCase());
    this.gallows.append(humanBody);
    this.letters = this.wordLetters.map((letter) => this.alphabet.render(letter));
    this.wordContainer.append(...this.letters);
    this.hint.innerText = newWord.hint;
    this.filling = (new Array(this.wordLetters.length)).fill(false);
  }

  renderKeyboard() {
    const alph = Object.keys(this.alphabet.letters);
    const keys = [];
    const handleKeyEvt = (letter) => {
      if (this.checkedLetters.includes(letter)) {
        console.log(letter, "already opened");
      } else {
        let isIncorrectGuess = [true];
        for (let i = 0; i < this.wordLetters.length; i++) {
          if (letter === this.wordLetters[i]) {
            isIncorrectGuess.push(false);
            this.checkedLetters.push(letter);
            this.filling[i] === letter;
            this.letters[i].classList.add("letter_active");
            this.keyboard[alph.indexOf(letter)].classList.add("key_correct");
            this.keyboard[alph.indexOf(letter)].disabled = true;
          }
        }
        console.log(isIncorrectGuess)
        if (isIncorrectGuess.every((el) => el)){
          if (this.numberOfGuesses < 6) {
            this.numberOfGuesses += 1;
            this.human.parts[this.numberOfGuesses - 1].classList.add("human__part_visible");
            this.keyboard[alph.indexOf(letter)].classList.add("key_wrong");
            this.keyboard[alph.indexOf(letter)].disabled = true;
            this.checkedLetters.push(letter);
            if (this.numberOfGuesses === 6) {
              this.human.erase();
              clearNode(this.wordContainer);
              this.renderNewGame();
            }
          }
        }
      }
    }
    Object.keys(this.alphabet.letters).forEach((letter) => {
      const newkey = document.createElement('button');
      newkey.innerText = letter;
      newkey.classList.add('key');
      newkey.onclick = () => {
        console.log(letter, this.wordLetters, this.filling);
        handleKeyEvt(letter);
      }
      keys.push(newkey);
    });
    window.addEventListener('keydown', (event) => {
      let letter = event.key.toUpperCase();
      console.log(letter)
      if (/[A-Z]{1}/.test(letter) && letter.length === 1) {
        handleKeyEvt(letter);
      } else {
        console.log('The word consist of english letters only (A-Z). Please, set the input language of the keyboard to EN and try again.');
      }
    })
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
          console.log(key);
          node.setAttribute(key, attrlist[key]);
        }
      }
    }
    if (content) {
      console.log(content);
      node.append(...content);
    }
    return node;
  }
}