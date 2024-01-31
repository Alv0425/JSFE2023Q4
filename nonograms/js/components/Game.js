import { Layout } from "./Layout.js";
import { Base } from "./Base.js";
import { Modal } from "./Modal.js";
export class Game extends Base {
  constructor(nonograms) {
    super();
    this.nonograms = nonograms;
    this.layout = null;
    this.timer = 0;
    this.interval = null;
    this.cluesX = [];
    this.cluesY = [];
    this.currentGame = [];
    this.isTimerRunning = false;
  }

  renderPlayboard() {
    this.layout = new Layout();
    this.layout.renderPage();
    this.openGame(this.nonograms[0]);
    this.layout.appButtons["reset game"].onclick = () => {
      this.openGame(this.currentGame);
    };
  }

  setTimer() {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true;
      this.interval = setInterval(() => {
        this.timer += 0.1;
        this.updateTimer();
      }, 100);
    }
  }
  openGame(game, state, timer) {
    this.isTimerRunning = false;
    this.layout.nonogramFieldCont.classList.remove("disabled");
    this.clearNode(this.layout.nonogramFieldCont);
    this.clearNode(this.layout.cluesXCont);
    this.clearNode(this.layout.cluesYCont);
    this.layout.gameNameCont.textContent = game.hint;
    this.cells = [];
    this.currentGame = game;
    if (!timer) timer = 0;
    if (!state) {
      state = new Array(game.size).fill(new Array(game.size).fill(0));
    }
    this.timer = timer;
    this.updateTimer();
    clearInterval(this.interval);
    this.interval = null;
    this.cluesX = [];
    this.cluesY = [];
    for (let i = 0; i < game.size; i++) {
      const row = [];
      for (let j = 0; j < game.size; j++) {
        const newCell = this.createNode("button", ["cell"]);
        if (state[i][j] === 1) newCell.classList.add("black");
        if (state[i][j] === 2) newCell.classList.add("cross");
        row.push(newCell);
      }
      this.cells.push(row);
    }
    const rows = this.cells.map((row) => {
      const newrow = this.createNode("div", ["row"]);
      this.cluesX.push(this.createNode("div", ["clues"]));
      this.cluesY.push(this.createNode("div", ["clues"]));
      newrow.append(...row);
      return newrow;
    });
    this.layout.cluesXCont.append(...this.cluesX);
    this.layout.cluesYCont.append(...this.cluesY);
    this.layout.nonogramFieldCont.append(...rows);
    this.layout.nonogramFieldCont.onclick = (event) => {
      if (event.target.classList.contains("cell")) {
        event.target.classList.remove("cross");
        event.target.classList.toggle("black");
        this.checkGameState();
        this.setTimer();
      }
    };
    this.layout.nonogramFieldCont.oncontextmenu = (event) => {
      event.preventDefault();
      if (event.target.classList.contains("cell")) {
        event.target.classList.remove("black");
        event.target.classList.toggle("cross");
        this.setTimer();
      }
    };

    const curRow = (y) => game.field[y];
    const curCol = (x) => game.field.map((row) => row[x]);
    const setClues = (arr) => {
      let len = 0;
      return arr.reduce((accum, cell, index) => {
        if (cell === 1) {
          len += 1;
          if (index === game.size - 1) accum.push(len);
        } else if (len !== 0) {
          accum.push(len);
          len = 0;
        }
        return accum;
      }, []);
    };
    const tipsX = [];
    const tipsY = [];
    for (let i = 0; i < game.size; i++) {
      tipsX.push(setClues(curCol(i)));
      tipsY.push(setClues(curRow(i)));
    }
    tipsX.forEach((tip, index) => {
      const tipsSetX = tip.map((num) => {
        return this.createNode("div", ["clue"], {}, `${num}`);
      });
      this.clearNode(this.cluesX[index]);
      this.cluesX[index].append(...tipsSetX);
    });
    tipsY.forEach((tip, index) => {
      const tipsSetY = tip.map((num) => {
        return this.createNode("div", ["clue"], {}, `${num}`);
      });
      this.clearNode(this.cluesY[index]);
      this.cluesY[index].append(...tipsSetY);
    });
  }

  convertTime(time) {
    time = Math.round(time);
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (time >= 60 * 60) {
      hours = Math.floor(time / (60 * 60));
      time = time - hours * (60 * 60);
    }
    if (time >= 60) {
      minutes = Math.floor(time / 60);
      time = time - minutes * 60;
    }
    seconds = time;

    return hours > 0
      ? `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      : `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
  }

  updateTimer() {
    this.layout.timerCont.textContent = this.convertTime(this.timer);
  }

  checkGameState() {
    const isWin = () => {
      for (let i = 0; i < this.currentGame.size; i++) {
        for (let j = 0; j < this.currentGame.size; j++) {
          if (
            this.currentGame.field[i][j] === 0 &&
            this.cells[i][j].classList.contains("black")
          )
            return false;
          if (
            this.currentGame.field[i][j] === 1 &&
            !this.cells[i][j].classList.contains("black")
          )
            return false;
        }
      }
      return true;
    };
    console.log(isWin());
    if (isWin()) {
      const winModal = new Modal("win");
      winModal.openModal();
      clearInterval(this.interval);
      const mini = this.showMiniature();
      const textWin = this.createNode("div", ["modal__text"]);
      textWin.textContent = `Great! You have solved the nonogram in ${Math.round(
        this.timer,
      )} seconds!"`;
      winModal.modalBody.append(mini, textWin);
      this.layout.nonogramFieldCont.classList.add("disabled");
      console.log("openned");
    }
  }

  showMiniature() {
    console.log(this.currentGame);
    const miniature = this.createNode("div", ["modal__miniature"]);
    for (let i = 0; i < this.currentGame.size; i++) {
      const row = this.createNode("div", ["modal__miniature-row"]);
      for (let j = 0; j < this.currentGame.size; j++) {
        const cell = this.createNode("div", ["modal__miniature-cell"]);
        if (this.currentGame.field[i][j] === 1) cell.classList.add("dark");
        row.append(cell);
      }
      miniature.append(row);
    }
    return miniature;
  }
}
