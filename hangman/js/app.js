"use strict";
import { Game } from "./components/Game.js";

let words;
async function getWords() {
  const result = await fetch("./js/words.json");
  words = await result.json();
  return words;
}

getWords().then(() => {
  console.log(
    `Пожалуйста, не забудьте переключить раскладку клавиатуры на EN!`,
  );
  const newGame = new Game();
  newGame.generateSequence(words);
  newGame.renderGameBoard();
});
