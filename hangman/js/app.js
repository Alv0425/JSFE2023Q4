"use strict";
// eslint-disable-next-line no-unused-vars
import { createNode, clearNode } from "./auxiliary.js";
const body = document.body;
body.classList.add("body");

const header = createNode("header", ["header", "wrapper"]);
const main = createNode("main", ["main", "wrapper"]);
const footer = createNode("footer", ["footer", "wrapper"]);
body.append(header, main, footer);
let words;
async function getWords() {
  const result = await fetch("./js/words.json");
  words = await result.json();
  return words;
}

getWords().then(() => {
  console.log(words);
});
