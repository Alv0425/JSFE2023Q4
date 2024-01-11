"use strict";
// eslint-disable-next-line no-unused-vars
import { createNode, clearNode } from "./auxiliary.js";
import { Human } from "./components/Human.js";
const body = document.body;
body.classList.add("body");
let numberOfGuesses = 0;

const header = createNode("header", ["header"]);
const headerContainer = createNode("div", ["header__container", "wrapper"]);
const headerLogo = createNode("h1", ["header__logo"], {}, "HANGMAN");
const headerInfo = createNode("button", ["header__info"], {}, "i");
headerContainer.append(headerLogo, headerInfo);
header.append(headerContainer);
const main = createNode("main", ["main", "wrapper"]);
const footer = createNode("footer", ["footer"]);
body.append(header, main, footer);

const footerContainer = createNode('div', ['footer__container', 'wrapper']);
const footerRSSLink = createNode('a', ['footer__rss-link'], {'href': 'https://rs.school/js/', 'target': '_blank'});
const footerDate = createNode('p', ['footer__date'], {}, 'Created in 2024 as part of an assignment from the Rolling Scopes School course');
const footerGithub = createNode('a', ['footer__github'], {'href': 'https://github.com/Alv0425', 'target': '_blank'}, "alv0425");
footerContainer.append(footerRSSLink, footerDate, footerGithub);
footer.append(footerContainer);

const gameContainer = createNode('div', ['hangman']);
const playBoard = createNode('div', ['hangman__playboard']);
const riddle = createNode('div');
const keyboard = createNode('div', ['hangman__keyboard']);
const scoreLabel = createNode('p', ['hangman__label'], {}, `Incorrect guesses: ${numberOfGuesses} / 6`);
const wordContainer = createNode('div', ['hangman__word']);
const hint = createNode('p', ['hangman__hint'], {}, 'Some text');
const gallows = createNode('div', ['hangman__gallows']);
const button = createNode('button', ['button'], {}, 'BUTTON');
const human = new Human;
const humanBody = human.render();
gallows.append(humanBody);
gameContainer.append(playBoard, keyboard);
playBoard.append(gallows, riddle);
riddle.append(scoreLabel, wordContainer, hint);
keyboard.append(button)

main.append(gameContainer);
// body.onkeydown = (event) => {console.log(`Key${(event.key).toUpperCase()}`==event.code)}
button.onclick = () => {
  if (numberOfGuesses < 6) {
    numberOfGuesses += 1;
    human.parts[numberOfGuesses - 1].classList.add('human__part_visible');
  } else {
    human.erase();
  }
}


let words;
async function getWords() {
  const result = await fetch("./js/words.json");
  words = await result.json();
  return words;
}

getWords().then(() => {
  console.log(words);
});
