import { Layout } from "./Layout.js";
import { Base } from "./Base.js";
export class Game extends Base {
  constructor(nonograms) {
    super();
    this.nonograms = nonograms;
    this.layout = null;
  }
  renderPlayboard() {
    this.layout = new Layout();
    this.layout.renderPage();
  }
}