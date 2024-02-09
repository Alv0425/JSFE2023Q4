import { Game } from "./components/Game.js";
let nonograms;
async function getNonograms() {
  const result = await fetch("./js/nonograms.json");
  nonograms = await result.json();
  return nonograms;
}
getNonograms().then(() => {
  console.log(`nonograms loaded`);
  let game = new Game(nonograms);
  game.renderPlayboard();
});



